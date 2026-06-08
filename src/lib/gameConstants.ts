// ============================================================
// lib/gameConstants.ts — Map pool, veto sequence, and helpers
// ============================================================

import { MapState, VetoStep, RoomState } from '@/types';

// ─── VCT Masters London 2026 Map Pool ────────────────────────
export const MAP_POOL: Omit<MapState, 'status'>[] = [
  { id: 'ascent',   name: 'Ascent'   },
  { id: 'breeze',   name: 'Breeze'   },
  { id: 'fracture', name: 'Fracture' },
  { id: 'haven',    name: 'Haven'    },
  { id: 'lotus',    name: 'Lotus'    },
  { id: 'pearl',    name: 'Pearl'    },
  { id: 'split',    name: 'Split'    },
];

// ─── 9-Step Bo3 Veto Sequence ────────────────────────────────
// Reference:
//   Step 1  → Team A bans
//   Step 2  → Team B bans
//   Step 3  → Team A picks Map 1
//   Step 4  → Team B picks side for Map 1
//   Step 5  → Team B picks Map 2
//   Step 6  → Team A picks side for Map 2
//   Step 7  → Team A bans
//   Step 8  → Team B bans
//   Step 9  → Remaining map becomes Map 3; Team A picks side
export const VETO_SEQUENCE: VetoStep[] = [
  { step: 1, team: 'teamA', action: 'ban',       label: 'Team A is banning a map...' },
  { step: 2, team: 'teamB', action: 'ban',       label: 'Team B is banning a map...' },
  { step: 3, team: 'teamA', action: 'pick_map',  label: 'Team A is picking Map 1...' },
  { step: 4, team: 'teamB', action: 'pick_side', label: 'Team B is picking a side for Map 1...', forPickOrder: 1 },
  { step: 5, team: 'teamB', action: 'pick_map',  label: 'Team B is picking Map 2...' },
  { step: 6, team: 'teamA', action: 'pick_side', label: 'Team A is picking a side for Map 2...', forPickOrder: 2 },
  { step: 7, team: 'teamA', action: 'ban',       label: 'Team A is banning a map...' },
  { step: 8, team: 'teamB', action: 'ban',       label: 'Team B is banning a map...' },
  { step: 9, team: 'teamA', action: 'pick_side', label: 'Map 3 is set! Team A is picking a side...', forPickOrder: 3 },
];

// ─── Build the initial room state ────────────────────────────
export function buildInitialRoomState(): RoomState {
  const maps: Record<string, MapState> = {};
  MAP_POOL.forEach((m) => {
    maps[m.id] = { ...m, status: 'available' };
  });
  return {
    currentStep: 1,
    maps,
    isComplete: false,
    lastUpdated: Date.now(),
  };
}

// ─── Get the current veto step descriptor ────────────────────
export function getCurrentStep(stepNumber: number): VetoStep | null {
  return VETO_SEQUENCE.find((s) => s.step === stepNumber) ?? null;
}

// ─── Map image URL helper ─────────────────────────────────────
// Using Valorant wiki / community placeholders.
// Replace these with your own hosted images or Next.js public/ assets.
export const MAP_IMAGE_URLS: Record<string, string> = {
  ascent:   'https://www.vicinitihosting.com/valorant-maps/ascent.jpg',
  breeze:   'https://www.vicinitihosting.com/valorant-maps/breeze.jpg',
  fracture: 'https://www.vicinitihosting.com/valorant-maps/fracture.jpg',
  haven:    'https://www.vicinitihosting.com/valorant-maps/haven.jpg',
  lotus:    'https://www.vicinitihosting.com/valorant-maps/lotus.jpg',
  pearl:    'https://www.vicinitihosting.com/valorant-maps/pearl.jpg',
  split:    'https://www.vicinitihosting.com/valorant-maps/split.jpg',
};

// ─── Map gradient colours (used as fallback backgrounds) ─────
export const MAP_COLORS: Record<string, string> = {
  ascent:   'from-amber-900 to-amber-700',
  breeze:   'from-cyan-900 to-teal-700',
  fracture: 'from-purple-900 to-violet-700',
  haven:    'from-green-900 to-emerald-700',
  lotus:    'from-rose-900 to-pink-700',
  pearl:    'from-blue-900 to-indigo-700',
  split:    'from-slate-700 to-slate-500',
};

// ─── Team display helpers ─────────────────────────────────────
export const TEAM_LABELS: Record<string, string> = {
  teamA: 'Team A',
  teamB: 'Team B',
};

export const TEAM_COLORS: Record<string, string> = {
  teamA: '#FF4655',   // val-red  (Team A = red/attack style)
  teamB: '#53B0F8',   // val-blue-light (Team B = blue)
};
