// ============================================================
// components/TurnIndicator.tsx — Status bar showing whose turn it is
// ============================================================

'use client';

import { Role } from '@/types';
import { VetoStep } from '@/types';
import { VETO_SEQUENCE, TEAM_COLORS } from '@/lib/gameConstants';

interface Props {
  step: VetoStep | null;
  stepNumber: number;
  role: Role;
  isMyTurn: boolean;
}

const ACTION_ICONS: Record<string, string> = {
  ban:       '🚫',
  pick_map:  '🗺️',
  pick_side: '🎯',
  auto_pick: '⚡',
  complete:  '✅',
};

export default function TurnIndicator({ step, stepNumber, role, isMyTurn }: Props) {
  if (!step) return null;

  const teamColor = TEAM_COLORS[step.team];
  const totalSteps = VETO_SEQUENCE.length;
  const progressPct = ((stepNumber - 1) / totalSteps) * 100;

  return (
    <div className="mb-6 animate-fade-in">

      {/* ── Main status box ── */}
      <div
        className={`
          relative panel clip-corner px-6 py-4 border
          ${isMyTurn ? 'border-pulse' : 'border-val-border'}
        `}
        style={isMyTurn ? { borderColor: teamColor } : {}}
      >
        {/* Left accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l"
          style={{ backgroundColor: teamColor }}
        />

        <div className="flex items-center justify-between flex-wrap gap-3 pl-3">
          {/* Step info */}
          <div className="flex items-center gap-4">
            <span className="text-3xl">{ACTION_ICONS[step.action]}</span>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="font-valorant text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                  style={{ color: teamColor, backgroundColor: `${teamColor}20` }}
                >
                  {step.team === 'teamA' ? 'Team A' : 'Team B'}
                </span>
                {isMyTurn && (
                  <span className="text-xs font-ui text-val-gold font-semibold animate-pulse">
                    ← YOUR TURN
                  </span>
                )}
              </div>
              <div className="font-valorant text-lg font-bold text-val-text tracking-wide">
                {step.label}
              </div>
            </div>
          </div>

          {/* Step counter */}
          <div className="text-right">
            <div className="font-valorant text-3xl font-extrabold" style={{ color: teamColor }}>
              {stepNumber}
              <span className="text-val-muted text-lg">/{totalSteps}</span>
            </div>
            <div className="text-val-muted text-xs font-ui uppercase tracking-widest">Step</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1 bg-val-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%`, backgroundColor: teamColor }}
          />
        </div>

        {/* Step dots */}
        <div className="flex gap-1.5 mt-2">
          {VETO_SEQUENCE.map((s) => (
            <div
              key={s.step}
              className="flex-1 h-1 rounded-full transition-all duration-300"
              style={{
                backgroundColor:
                  s.step < stepNumber
                    ? TEAM_COLORS[s.team]
                    : s.step === stepNumber
                    ? teamColor
                    : 'rgba(42,58,74,0.8)',
                opacity: s.step === stepNumber ? 1 : s.step < stepNumber ? 0.5 : 0.3,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Spectator / waiting notice ── */}
      {!isMyTurn && role !== 'spectator' && (
        <p className="text-center text-val-muted text-xs font-ui mt-2 tracking-wider">
          Waiting for {step.team === 'teamA' ? 'Team A' : 'Team B'} to make their selection...
        </p>
      )}
      {role === 'spectator' && (
        <p className="text-center text-val-gold/70 text-xs font-ui mt-2 tracking-wider">
          👁 SPECTATOR MODE — View only
        </p>
      )}
    </div>
  );
}
