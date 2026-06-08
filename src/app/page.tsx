// ============================================================
// app/page.tsx — Landing page: choose your role
// ============================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '@/types';

const ROLES: { id: Role; label: string; description: string; color: string; icon: string }[] = [
  {
    id: 'teamA',
    label: 'TEAM A',
    description: 'Control Team A\'s bans and picks during the draft.',
    color: 'border-val-red hover:border-val-red hover:glow-red',
    icon: '⚔️',
  },
  {
    id: 'teamB',
    label: 'TEAM B',
    description: 'Control Team B\'s bans and picks during the draft.',
    color: 'border-val-blue-light hover:border-val-blue-light',
    icon: '🛡️',
  },
  {
    id: 'spectator',
    label: 'SPECTATOR',
    description: 'Watch the draft in real-time without interacting.',
    color: 'border-val-gold hover:border-val-gold',
    icon: '👁️',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Role | null>(null);

  function handleJoin() {
    if (!selected) return;
    router.push(`/veto?role=${selected}`);
  }

  return (
    <main className="bg-tactical min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* ── Background decorative elements ── */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-val-red/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-val-blue/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* ── Logo / Header ── */}
      <div className="text-center mb-12 animate-fade-in">
        {/* VALORANT-style top accent line */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-val-red" />
          <span className="text-val-red text-xs font-valorant tracking-[0.4em] uppercase">VCT Masters London 2026</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-val-red" />
        </div>

        <h1 className="font-valorant text-6xl md:text-7xl font-extrabold uppercase tracking-wider text-val-text leading-none">
          MAP VETO
        </h1>
        <h2 className="font-valorant text-2xl text-val-red font-bold uppercase tracking-[0.3em] mt-1">
          Best of 3
        </h2>

        <p className="font-ui text-val-muted text-sm mt-4 max-w-md mx-auto leading-relaxed">
          Real-time map ban/pick system. Select your role to enter the draft room.
          All actions sync instantly across all connected clients.
        </p>
      </div>

      {/* ── Role Selection Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-3xl mb-8">
        {ROLES.map((role, i) => (
          <button
            key={role.id}
            onClick={() => setSelected(role.id)}
            style={{ animationDelay: `${i * 100}ms` }}
            className={`
              relative panel clip-corner p-6 text-left cursor-pointer transition-all duration-200
              border-2 animate-slide-up group
              ${selected === role.id
                ? role.id === 'teamA'
                  ? 'border-val-red bg-val-red/10'
                  : role.id === 'teamB'
                  ? 'border-val-blue-light bg-val-blue-light/10'
                  : 'border-val-gold bg-val-gold/10'
                : 'border-val-border hover:border-val-muted'
              }
            `}
          >
            {/* Selection indicator */}
            {selected === role.id && (
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-val-red animate-pulse" />
            )}

            <div className="text-3xl mb-3">{role.icon}</div>

            <div className={`
              font-valorant text-xl font-bold uppercase tracking-wider mb-2
              ${selected === role.id
                ? role.id === 'teamA' ? 'text-val-red'
                : role.id === 'teamB' ? 'text-val-blue-light'
                : 'text-val-gold'
                : 'text-val-text group-hover:text-white'
              }
            `}>
              {role.label}
            </div>

            <p className="text-val-muted text-sm leading-relaxed font-ui">
              {role.description}
            </p>

            {/* Bottom accent */}
            <div className={`
              absolute bottom-0 left-0 h-0.5 transition-all duration-300
              ${selected === role.id ? 'w-full' : 'w-0 group-hover:w-full'}
              ${role.id === 'teamA' ? 'bg-val-red'
                : role.id === 'teamB' ? 'bg-val-blue-light'
                : 'bg-val-gold'
              }
            `} />
          </button>
        ))}
      </div>

      {/* ── Enter Button ── */}
      <button
        onClick={handleJoin}
        disabled={!selected}
        className={`
          relative font-valorant text-lg font-bold uppercase tracking-[0.2em]
          px-12 py-4 clip-corner transition-all duration-200
          ${selected
            ? 'bg-val-red text-white hover:bg-val-red-dark cursor-pointer glow-red'
            : 'bg-val-border/50 text-val-muted cursor-not-allowed'
          }
        `}
      >
        {selected ? `ENTER AS ${ROLES.find(r => r.id === selected)?.label}` : 'SELECT A ROLE'}
      </button>

      {/* ── Step sequence preview ── */}
      <div className="mt-12 w-full max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-val-border" />
          <span className="text-val-muted text-xs font-valorant tracking-widest uppercase">Bo3 Veto Sequence</span>
          <div className="h-px flex-1 bg-val-border" />
        </div>
        <div className="grid grid-cols-3 md:grid-cols-9 gap-1.5">
          {[
            { step: 1, label: 'A Ban',    color: 'bg-val-red/20 text-val-red' },
            { step: 2, label: 'B Ban',    color: 'bg-val-blue-light/20 text-val-blue-light' },
            { step: 3, label: 'A Pick',   color: 'bg-val-red/20 text-val-red' },
            { step: 4, label: 'B Side',   color: 'bg-val-blue-light/20 text-val-blue-light' },
            { step: 5, label: 'B Pick',   color: 'bg-val-blue-light/20 text-val-blue-light' },
            { step: 6, label: 'A Side',   color: 'bg-val-red/20 text-val-red' },
            { step: 7, label: 'A Ban',    color: 'bg-val-red/20 text-val-red' },
            { step: 8, label: 'B Ban',    color: 'bg-val-blue-light/20 text-val-blue-light' },
            { step: 9, label: 'A Side',   color: 'bg-val-gold/20 text-val-gold' },
          ].map((s) => (
            <div key={s.step} className={`${s.color} rounded px-2 py-1.5 text-center`}>
              <div className="text-xs font-bold">{s.step}</div>
              <div className="text-xs opacity-80 font-ui">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
