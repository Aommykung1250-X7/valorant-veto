// ============================================================
// components/VetoRoom.tsx — Main draft room client component
// ============================================================

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useRoom } from '@/hooks/useRoom';
import { Role, Side } from '@/types';
import { getCurrentStep, TEAM_LABELS, TEAM_COLORS, VETO_SEQUENCE } from '@/lib/gameConstants';
import { banMap, pickMap, pickSide, resetRoom } from '@/lib/roomActions';
import MapGrid from './MapGrid';
import TurnIndicator from './TurnIndicator';
import SidePicker from './SidePicker';
import MatchSummary from './MatchSummary';

export default function VetoRoom() {
  const router = useRouter();
  const params = useSearchParams();
  const role = (params.get('role') ?? 'spectator') as Role;

  const { roomState, loading } = useRoom();

  if (loading) {
    return (
      <div className="min-h-screen bg-val-darker flex items-center justify-center">
        <div className="text-center">
          <div className="font-valorant text-2xl text-val-red animate-pulse tracking-widest mb-2">CONNECTING...</div>
          <div className="text-val-muted text-sm font-ui">Syncing with Firebase Realtime Database</div>
        </div>
      </div>
    );
  }

  const currentStepDef = getCurrentStep(roomState.currentStep);

  // BUG FIX: Guard against the edge case where currentStep has advanced past the
  // sequence length but isComplete hasn't been written yet (rare Firebase transit state).
  // In that case we treat the draft as complete so the UI doesn't get stuck.
  const isDraftOver = roomState.isComplete || roomState.currentStep > VETO_SEQUENCE.length;

  const isMyTurn = !isDraftOver && !!currentStepDef && currentStepDef.team === role;
  const currentAction = currentStepDef?.action ?? 'complete';

  // ── Action Handlers ────────────────────────────────────────

  async function handleBan(mapId: string) {
    if (!isMyTurn || currentAction !== 'ban') return;
    await banMap(roomState, mapId, role as 'teamA' | 'teamB');
  }

  async function handlePickMap(mapId: string) {
    if (!isMyTurn || currentAction !== 'pick_map') return;
    await pickMap(roomState, mapId, role as 'teamA' | 'teamB');
  }

  async function handlePickSide(side: Side) {
    if (!isMyTurn || currentAction !== 'pick_side') return;
    await pickSide(roomState, side, role as 'teamA' | 'teamB');
  }

  async function handleReset() {
    await resetRoom();
  }

  // ── Role colour scheme ─────────────────────────────────────
  const roleColor = role === 'teamA' ? TEAM_COLORS.teamA
    : role === 'teamB' ? TEAM_COLORS.teamB
    : '#E5C07B';

  const roleLabel = role === 'teamA' ? 'TEAM A'
    : role === 'teamB' ? 'TEAM B'
    : 'SPECTATOR';

  return (
    <div className="bg-tactical min-h-screen flex flex-col">

      {/* ── Top Nav Bar ── */}
      <nav className="panel border-b border-val-border px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {/* Back to home */}
          <button
            onClick={() => router.push('/')}
            className="text-val-muted hover:text-val-text text-sm font-ui transition-colors"
          >
            ← EXIT
          </button>
          <div className="h-5 w-px bg-val-border" />
          <span className="font-valorant text-lg font-bold tracking-wider text-val-text">MAP VETO</span>
          <span className="text-val-muted text-xs font-ui">Bo3 · VCT Masters London 2026</span>
        </div>

        {/* Role badge */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-bold font-valorant tracking-wider"
          style={{ borderColor: roleColor, color: roleColor, backgroundColor: `${roleColor}15` }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: roleColor }} />
          {roleLabel}
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl">

        {isDraftOver ? (
          // ── Final Summary Screen ───────────────────────────
          <MatchSummary roomState={roomState} onReset={handleReset} />
        ) : (
          <>
            {/* ── Turn Indicator ── */}
            <TurnIndicator
              step={currentStepDef}
              stepNumber={roomState.currentStep}
              role={role}
              isMyTurn={isMyTurn}
            />

            {/* ── Side Picker (shown during pick_side steps) ── */}
            {currentAction === 'pick_side' && isMyTurn && (
              <SidePicker
                forPickOrder={currentStepDef?.forPickOrder ?? 1}
                maps={roomState.maps}
                onPickSide={handlePickSide}
              />
            )}

            {/* ── Map Grid ── */}
            <MapGrid
              maps={roomState.maps}
              isMyTurn={isMyTurn}
              currentAction={currentAction}
              onBan={handleBan}
              onPick={handlePickMap}
            />

            {/* ── Reset Button (always visible, for quick resets during testing) ── */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleReset}
                className="text-val-muted hover:text-val-text text-xs font-ui border border-val-border hover:border-val-muted px-4 py-2 rounded transition-all duration-200"
              >
                ↺ RESET ROOM
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}