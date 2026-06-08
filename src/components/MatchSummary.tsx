// ============================================================
// components/MatchSummary.tsx — Post-draft summary (redesigned)
// ============================================================

'use client';

import { RoomState } from '@/types';
import { TEAM_COLORS } from '@/lib/gameConstants';

interface Props {
  roomState: RoomState;
  onReset: () => void;
}

// Valorant map splash art from the official media kit / wiki
// Format: wide "splash" images that work well as card backgrounds
const MAP_SPLASH: Record<string, string> = {
  ascent:   'https://static.wikia.nocookie.net/valorant/images/e/e7/Loading_Screen_Ascent.png',
  breeze:   'https://static.wikia.nocookie.net/valorant/images/1/10/Loading_Screen_Breeze.png',
  fracture: 'https://static.wikia.nocookie.net/valorant/images/f/fc/Loading_Screen_Fracture.png',
  haven:    'https://static.wikia.nocookie.net/valorant/images/7/70/Loading_Screen_Haven.png',
  lotus:    'https://static.wikia.nocookie.net/valorant/images/d/d0/Loading_Screen_Lotus.png',
  pearl:    'https://static.wikia.nocookie.net/valorant/images/a/af/Loading_Screen_Pearl.png',
  split:    'https://static.wikia.nocookie.net/valorant/images/d/d6/Loading_Screen_Split.png',
};

// Fallback gradient per map in case image fails to load
const MAP_BG: Record<string, string> = {
  ascent:   'linear-gradient(135deg,#3d2800,#9a7520)',
  breeze:   'linear-gradient(135deg,#00202e,#00728f)',
  fracture: 'linear-gradient(135deg,#1a0030,#7a12c0)',
  haven:    'linear-gradient(135deg,#00200a,#0a7040)',
  lotus:    'linear-gradient(135deg,#2d0010,#b00855)',
  pearl:    'linear-gradient(135deg,#000d2e,#0a3a8f)',
  split:    'linear-gradient(135deg,#111827,#4b5563)',
};

export default function MatchSummary({ roomState, onReset }: Props) {
  const maps = Object.values(roomState.maps);

  const pickedMaps = maps
    .filter((m) => m.status === 'picked' && m.pickOrder)
    .sort((a, b) => (a.pickOrder ?? 0) - (b.pickOrder ?? 0));

  const bannedMaps = maps
    .filter((m) => m.status === 'banned')
    .sort((a, b) => {
      // Show Team A bans first, then Team B bans
      if (b.bannedBy === a.bannedBy) return 0;
      return a.bannedBy === 'teamA' ? -1 : 1;
    });

  return (
    <div className="animate-slide-up max-w-4xl mx-auto pb-10">

      {/* ── Header ────────────────────────────────────────────── */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-val-gold" />
          <span className="text-val-gold text-xs font-valorant tracking-[0.4em] uppercase">Draft Complete</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-val-gold" />
        </div>
        <h2 className="font-valorant text-5xl md:text-6xl font-extrabold uppercase tracking-wider text-val-text leading-none">
          MATCH LINEUP
        </h2>
        <p className="text-val-muted text-sm font-ui mt-2">Best of 3 · VCT Masters London 2026</p>
      </div>

      {/* ── Map Cards (3 picked maps) ─────────────────────────── */}
      <div className="flex flex-col gap-4 mb-8">
        {pickedMaps.map((map) => {
          const isDecider    = map.pickOrder === 3;
          const pickerColor  = map.pickedBy ? TEAM_COLORS[map.pickedBy] : '#E5C07B';
          const sideColor    = map.side === 'attack' ? '#f97316' : '#38bdf8';
          const oppositeSide = map.side === 'attack' ? 'defend' : 'attack';
          const sideTeam     = map.sideChosenBy;          // team that CHOSE the side
          // The opposing team starts on the opposite side
          const oppositeTeam = sideTeam === 'teamA' ? 'teamB' : sideTeam === 'teamB' ? 'teamA' : null;

          return (
            <div
              key={map.id}
              className="relative rounded overflow-hidden border border-white/10"
              style={{ minHeight: '148px' }}
            >
              {/* ── Background splash image ── */}
              <div className="absolute inset-0" style={{ background: MAP_BG[map.id] }}>
                {MAP_SPLASH[map.id] && (
                  <img
                    src={MAP_SPLASH[map.id]}
                    alt={map.name}
                    className="w-full h-full object-cover opacity-40"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>

              {/* ── Dark gradient overlay (left side for readability) ── */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />

              {/* ── Coloured top border ── */}
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: pickerColor }} />

              {/* ── Content ── */}
              <div className="relative flex items-stretch h-full">

                {/* LEFT — Map number + name + who picked it */}
                <div className="flex items-center gap-4 px-5 py-5 flex-1 min-w-0">

                  {/* Map number pill */}
                  <div
                    className="shrink-0 w-12 h-12 rounded flex flex-col items-center justify-center border font-valorant leading-none"
                    style={{ borderColor: `${pickerColor}60`, backgroundColor: `${pickerColor}18` }}
                  >
                    <span className="text-xs font-bold opacity-70" style={{ color: pickerColor }}>
                      {isDecider ? 'DECIDER' : 'MAP'}
                    </span>
                    <span className="text-2xl font-extrabold" style={{ color: pickerColor }}>
                      {map.pickOrder}
                    </span>
                  </div>

                  {/* Map name + picker */}
                  <div className="min-w-0">
                    <div className="font-valorant text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wider leading-none">
                      {map.name}
                    </div>
                    <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                      {map.pickedBy ? (
                        <span
                          className="text-xs font-valorant font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                          style={{ color: pickerColor, backgroundColor: `${pickerColor}22`, border: `1px solid ${pickerColor}44` }}
                        >
                          🗺️ Picked by {map.pickedBy === 'teamA' ? 'Team A' : 'Team B'}
                        </span>
                      ) : (
                        <span className="text-xs font-valorant font-bold px-2 py-0.5 rounded uppercase tracking-wider text-val-gold border border-val-gold/30 bg-val-gold/10">
                          ⚡ Decider Map
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT — Side breakdown: who plays what */}
                <div className="shrink-0 flex flex-col items-end justify-center gap-2 px-5 py-4">

                  {/* Team A side */}
                  <SideRow
                    team="teamA"
                    side={
                      sideTeam === 'teamA' ? map.side ?? null
                      : oppositeTeam === 'teamA' ? oppositeSide
                      : null
                    }
                  />

                  {/* Divider */}
                  <div className="w-full h-px bg-white/10 my-0.5" />

                  {/* Team B side */}
                  <SideRow
                    team="teamB"
                    side={
                      sideTeam === 'teamB' ? map.side ?? null
                      : oppositeTeam === 'teamB' ? oppositeSide
                      : null
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Banned Maps row ──────────────────────────────────── */}
      {bannedMaps.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-val-border" />
            <span className="text-val-muted text-xs font-valorant tracking-[0.3em] uppercase">Banned</span>
            <div className="h-px flex-1 bg-val-border" />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {bannedMaps.map((map) => {
              const bannerColor = map.bannedBy ? TEAM_COLORS[map.bannedBy] : '#7B8B9A';
              return (
                <div
                  key={map.id}
                  className="relative rounded overflow-hidden flex items-center gap-0"
                  style={{ border: `1px solid ${bannerColor}30` }}
                >
                  {/* tiny map thumbnail */}
                  <div className="relative w-16 h-10 shrink-0 overflow-hidden">
                    <div className="absolute inset-0" style={{ background: MAP_BG[map.id] }} />
                    {MAP_SPLASH[map.id] && (
                      <img
                        src={MAP_SPLASH[map.id]}
                        alt={map.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-red-400 text-lg font-black" style={{ textShadow: '0 0 8px rgba(255,0,0,0.8)' }}>✕</span>
                    </div>
                  </div>
                  {/* name + banner */}
                  <div className="px-3 py-1.5 bg-val-panel/80">
                    <div className="font-valorant text-xs font-bold text-val-text uppercase">{map.name}</div>
                    {map.bannedBy && (
                      <div className="text-xs font-ui" style={{ color: bannerColor }}>
                        {map.bannedBy === 'teamA' ? 'Team A' : 'Team B'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Reset ─────────────────────────────────────────────── */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="font-valorant text-base font-bold uppercase tracking-[0.2em] px-10 py-4 clip-corner bg-val-red hover:bg-val-red-dark text-white transition-all duration-200 glow-red"
        >
          ↺ RESET ROOM
        </button>
        <p className="text-val-muted text-xs font-ui mt-3">Resets the room for all connected clients</p>
      </div>
    </div>
  );
}

// ── Helper: one row showing a team's side assignment ──────────
function SideRow({ team, side }: { team: 'teamA' | 'teamB'; side: 'attack' | 'defend' | null }) {
  const teamColor  = TEAM_COLORS[team];
  const teamLabel  = team === 'teamA' ? 'Team A' : 'Team B';
  const sideColor  = side === 'attack' ? '#f97316' : side === 'defend' ? '#38bdf8' : '#7B8B9A';
  const sideIcon   = side === 'attack' ? '⚔️' : side === 'defend' ? '🛡️' : '—';
  const sideLabel  = side === 'attack' ? 'ATTACK' : side === 'defend' ? 'DEFEND' : 'TBD';

  return (
    <div className="flex items-center gap-2 min-w-[160px] justify-end">
      {/* Team label */}
      <span className="font-valorant text-xs font-bold uppercase" style={{ color: teamColor }}>
        {teamLabel}
      </span>

      {/* Separator */}
      <span className="text-val-border text-xs">·</span>

      {/* Side badge */}
      <span
        className="font-valorant text-xs font-extrabold uppercase px-2 py-1 rounded tracking-wider"
        style={{ color: sideColor, backgroundColor: `${sideColor}18`, border: `1px solid ${sideColor}40` }}
      >
        {sideIcon} {sideLabel}
      </span>
    </div>
  );
}
