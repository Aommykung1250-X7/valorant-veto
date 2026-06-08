// ============================================================
// components/SidePicker.tsx — Attack / Defend side selection
// ============================================================

'use client';

import { MapState, Side } from '@/types';

interface Props {
  forPickOrder: 1 | 2 | 3;
  maps: Record<string, MapState>;
  onPickSide: (side: Side) => void;
}

export default function SidePicker({ forPickOrder, maps, onPickSide }: Props) {
  // Find the target map by pick order
  const targetMap = Object.values(maps).find((m) => m.pickOrder === forPickOrder);

  return (
    <div className="mb-6 animate-slide-up">
      <div className="panel border border-val-gold/40 rounded p-5 text-center relative overflow-hidden">

        {/* Background accent */}
        <div className="absolute inset-0 bg-val-gold/3 pointer-events-none" />

        <div className="relative">
          <div className="text-val-gold text-xs font-valorant tracking-[0.4em] uppercase mb-1">
            🎯 Side Selection
          </div>
          <div className="font-valorant text-lg font-bold text-val-text mb-4">
            Choose your starting side for{' '}
            <span className="text-val-gold">
              {targetMap?.name ?? `Map ${forPickOrder}`}
            </span>
          </div>

          <div className="flex gap-4 justify-center">
            {/* Attack */}
            <button
              onClick={() => onPickSide('attack')}
              className="
                group relative px-8 py-4 font-valorant font-bold text-base uppercase tracking-wider
                border-2 border-orange-500/60 text-orange-300 bg-orange-500/10
                hover:bg-orange-500/25 hover:border-orange-400 hover:text-orange-200
                clip-corner transition-all duration-200 min-w-[140px]
              "
            >
              <div className="text-2xl mb-1">⚔️</div>
              <div>ATTACK</div>
              <div className="text-xs opacity-60 font-ui normal-case tracking-normal mt-0.5">Start on Attack</div>
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ boxShadow: 'inset 0 0 20px rgba(249,115,22,0.15)' }} />
            </button>

            <div className="flex items-center text-val-border font-valorant text-sm">VS</div>

            {/* Defend */}
            <button
              onClick={() => onPickSide('defend')}
              className="
                group relative px-8 py-4 font-valorant font-bold text-base uppercase tracking-wider
                border-2 border-sky-500/60 text-sky-300 bg-sky-500/10
                hover:bg-sky-500/25 hover:border-sky-400 hover:text-sky-200
                clip-corner transition-all duration-200 min-w-[140px]
              "
            >
              <div className="text-2xl mb-1">🛡️</div>
              <div>DEFEND</div>
              <div className="text-xs opacity-60 font-ui normal-case tracking-normal mt-0.5">Start on Defense</div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ boxShadow: 'inset 0 0 20px rgba(14,165,233,0.15)' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
