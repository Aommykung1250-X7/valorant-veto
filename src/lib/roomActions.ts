// ============================================================
// lib/roomActions.ts — All Firebase read/write operations
// ============================================================

import { ref, set, onValue, off } from 'firebase/database';
import { db } from './firebase';
import { RoomState, Side } from '@/types';
import { buildInitialRoomState, getCurrentStep, VETO_SEQUENCE } from './gameConstants';

const ROOM_REF = 'room'; // Root key in the Realtime Database

// ─── Subscribe to room state changes ─────────────────────────
export function subscribeToRoom(callback: (state: RoomState) => void) {
  const roomRef = ref(db, ROOM_REF);
  onValue(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as RoomState);
    } else {
      // Room doesn't exist yet — initialise it
      resetRoom();
    }
  });
  // Return an unsubscribe function
  return () => off(roomRef);
}

// ─── Reset / initialise the room ─────────────────────────────
export async function resetRoom() {
  const roomRef = ref(db, ROOM_REF);
  await set(roomRef, buildInitialRoomState());
}

// ─── Apply a ban action ──────────────────────────────────────
export async function banMap(state: RoomState, mapId: string, team: 'teamA' | 'teamB') {
  const step = getCurrentStep(state.currentStep);
  if (!step || step.action !== 'ban' || step.team !== team) return; // Guard

  const updatedMaps = {
    ...state.maps,
    [mapId]: {
      ...state.maps[mapId],
      status: 'banned' as const,
      bannedBy: team,
    },
  };

  const nextStep = state.currentStep + 1;

  // BUG FIX: isComplete must NOT be set here.
  // The draft only finishes after step 9 (the side-pick), which is handled in pickSide().
  // The old code set isComplete = (nextStep > 9), but step 8 → nextStep 9, so that was
  // always false anyway — but it also meant the auto-resolve block (isComplete guard) 
  // never fired, leaving Map 3 without a pickOrder and breaking step 9.

  // BUG FIX: auto-resolve Map 3 when transitioning INTO step 9, not when isComplete.
  // pickSide() finds the decider map by pickOrder === 3; it must be set before step 9 runs.
  const finalMaps = nextStep === 9 ? autoResolveFinalMap(updatedMaps) : updatedMaps;

  const roomRef = ref(db, ROOM_REF);
  await set(roomRef, {
    ...state,
    maps: finalMaps,
    currentStep: nextStep,
    isComplete: false,          // Intentionally false — pickSide() owns the completion flag
    lastUpdated: Date.now(),
  } as RoomState);
}

// ─── Apply a map pick action ─────────────────────────────────
export async function pickMap(state: RoomState, mapId: string, team: 'teamA' | 'teamB') {
  const step = getCurrentStep(state.currentStep);
  if (!step || step.action !== 'pick_map' || step.team !== team) return; // Guard

  // Determine pick order: count existing picked maps + 1
  const existingPicks = Object.values(state.maps).filter((m) => m.status === 'picked').length;
  const pickOrder = (existingPicks + 1) as 1 | 2;

  const updatedMaps = {
    ...state.maps,
    [mapId]: {
      ...state.maps[mapId],
      status: 'picked' as const,
      pickedBy: team,
      pickOrder,
    },
  };

  const roomRef = ref(db, ROOM_REF);
  await set(roomRef, {
    ...state,
    maps: updatedMaps,
    currentStep: state.currentStep + 1,
    lastUpdated: Date.now(),
  } as RoomState);
}

// ─── Apply a side pick action ─────────────────────────────────
export async function pickSide(state: RoomState, side: Side, team: 'teamA' | 'teamB') {
  const step = getCurrentStep(state.currentStep);
  if (!step || step.action !== 'pick_side' || step.team !== team) return; // Guard

  const targetPickOrder = step.forPickOrder;

  // Find the map matching the expected pickOrder (set by pickMap or autoResolveFinalMap)
  let targetMapId = Object.keys(state.maps).find(
    (id) => state.maps[id].pickOrder === targetPickOrder
  );

  // BUG FIX — defensive fallback for step 9:
  // If the decider map somehow wasn't promoted by autoResolveFinalMap (e.g. a race
  // condition or an older database snapshot), find the sole remaining available map
  // and promote it on-the-fly so the draft can still complete correctly.
  if (!targetMapId && targetPickOrder === 3) {
    const remainingIds = Object.keys(state.maps).filter(
      (id) => state.maps[id].status === 'available'
    );
    if (remainingIds.length === 1) {
      targetMapId = remainingIds[0];
      console.warn(
        '[pickSide] Map 3 was not pre-resolved — promoting remaining map on-the-fly:',
        targetMapId
      );
    }
  }

  // Hard guard: if we still can't locate the target map, bail and log clearly.
  if (!targetMapId) {
    console.error(
      '[pickSide] Could not find target map for pickOrder', targetPickOrder,
      '— current maps:', state.maps
    );
    return;
  }

  // Ensure the map has pickOrder: 3 written (handles the on-the-fly promotion path)
  const mapBeforeUpdate = state.maps[targetMapId];
  const updatedMaps = {
    ...state.maps,
    [targetMapId]: {
      ...mapBeforeUpdate,
      status: 'picked' as const,
      pickOrder: targetPickOrder,   // Idempotent if already set; fixes on-the-fly path
      side,
      sideChosenBy: team,
    },
  };

  const nextStep = state.currentStep + 1;
  // BUG FIX: isComplete is now exclusively determined here (step 9 is the last action).
  // nextStep becomes 10, which is > VETO_SEQUENCE.length (9) → isComplete = true.
  const isComplete = nextStep > VETO_SEQUENCE.length;

  const roomRef = ref(db, ROOM_REF);
  await set(roomRef, {
    ...state,
    maps: updatedMaps,
    currentStep: nextStep,
    isComplete,                     // true when this is step 9, false for steps 4 & 6
    lastUpdated: Date.now(),
  } as RoomState);
}

// ─── Internal: auto-resolve the last remaining map as Map 3 ──
// Called by banMap() when transitioning from step 8 → step 9.
// Finds the single available map and stamps it with pickOrder: 3 so that
// pickSide() (step 9) can locate it reliably via `pickOrder === 3`.
function autoResolveFinalMap(maps: Record<string, import('@/types').MapState>) {
  const remainingIds = Object.keys(maps).filter((id) => maps[id].status === 'available');

  // Defensive: there should be exactly one map left at this point.
  if (remainingIds.length === 0) {
    console.error('[autoResolveFinalMap] No available maps remaining — cannot resolve Map 3.');
    return maps;
  }
  if (remainingIds.length > 1) {
    console.warn(
      '[autoResolveFinalMap] Expected 1 remaining map but found', remainingIds.length,
      '— using the first one:', remainingIds[0]
    );
  }

  const remainingId = remainingIds[0];
  return {
    ...maps,
    [remainingId]: {
      ...maps[remainingId],
      status: 'picked' as const,
      pickOrder: 3 as const,
      // Explicitly clear team ownership — this map was not chosen by either team.
      // We set to null rather than undefined so Firebase stores the key as null
      // (undefined would drop the field, which is fine, but null is more explicit).
      pickedBy: null,
    },
  };
}
