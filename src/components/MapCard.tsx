// ============================================================
// components/MapCard.tsx — Individual map card (Updated)
// ============================================================

'use client';

import { MapState, ActionType } from '@/types';
import { TEAM_COLORS } from '@/lib/gameConstants';

interface Props {
  map: MapState;
  index: number;
  isMyTurn: boolean;
  currentAction: ActionType;
  onBan: (mapId: string) => void;
  onPick: (mapId: string) => void;
}

// Valorant map splash art from the official media kit / wiki
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

export default function MapCard({ map, index, isMyTurn, currentAction, onBan, onPick }: Props) {
  const isBanned  = map.status === 'banned';
  const isPicked  = map.status === 'picked';
  const isAvailable = map.status === 'available';

  // Can the user interact with this card right now?
  const canBan  = isMyTurn && currentAction === 'ban'      && isAvailable;
  const canPick = isMyTurn && currentAction === 'pick_map' && isAvailable;
  const isClickable = canBan || canPick;

  const teamColor = map.bannedBy ? TEAM_COLORS[map.bannedBy]
    : map.pickedBy ? TEAM_COLORS[map.pickedBy]
    : null;

  function handleClick() {
    if (!isClickable) return;
    if (canBan)  onBan(map.id);
    if (canPick) onPick(map.id);
  }

  return (
    <div
      style={{ animationDelay: `${index * 60}ms` }}
      className="animate-fade-in"
    >
      <button
        onClick={handleClick}
        disabled={!isClickable}
        className={`
          relative w-full aspect-[4/3] overflow-hidden rounded
          map-card-hover scanlines
          border-2 transition-all duration-200
          ${isBanned  ? 'opacity-60 cursor-not-allowed border-val-border/30' : ''}
          ${isPicked  ? 'cursor-default' : ''}
          ${isClickable && canBan  ? 'border-val-red/50 hover:border-val-red cursor-pointer glow-red' : ''}
          ${isClickable && canPick ? 'border-val-blue-light/50 hover:border-val-blue-light cursor-pointer glow-blue' : ''}
          ${isAvailable && !isClickable ? 'border-val-border/40 cursor-not-allowed' : ''}
          ${isPicked && !isBanned ? 'border-2' : ''}
        `}
        style={{
          background: MAP_BG[map.id] ?? '#1A2733',
          borderColor: isPicked && teamColor ? `${teamColor}80` : undefined,
        }}
      >
        {/* ── Background splash image ── */}
        {MAP_SPLASH[map.id] && (
          <img
            src={MAP_SPLASH[map.id]}
            alt={map.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${isBanned ? 'grayscale opacity-30' : 'opacity-60'}`}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}

        {/* ── Dark overlay for card readability ── */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* ── Grayscale overlay for banned maps ── */}
        {isBanned && (
          <div className="absolute inset-0 bg-black/50 backdrop-grayscale" />
        )}

        {/* ── Pick team colour tint ── */}
        {isPicked && teamColor && (
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundColor: teamColor }}
          />
        )}

        {/* ── Hover action hint ── */}
        {isClickable && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/50 backdrop-blur-[1px]">
            <div
              className="font-valorant text-sm font-bold uppercase tracking-wider px-3 py-1.5 rounded clip-corner-sm shadow-lg"
              style={{ backgroundColor: canBan ? '#FF4655' : '#53B0F8', color: '#fff' }}
            >
              {canBan ? '🚫 BAN' : '🗺️ PICK'}
            </div>
          </div>
        )}

        {/* ── BANNED overlay ── */}
        {isBanned && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            {/* Big X */}
            <div className="text-red-500 text-4xl font-black leading-none" style={{ textShadow: '0 0 20px rgba(255,0,0,0.8)' }}>
              ✕
            </div>
            <div className="font-valorant text-xs font-bold tracking-[0.3em] text-red-400 mt-1">BANNED</div>
            {map.bannedBy && (
              <div
                className="text-xs font-ui mt-1 opacity-90 font-medium px-1.5 py-0.5 rounded bg-black/40"
                style={{ color: TEAM_COLORS[map.bannedBy] }}
              >
                by {map.bannedBy === 'teamA' ? 'Team A' : 'Team B'}
              </div>
            )}
          </div>
        )}

        {/* ── PICKED overlay ── */}
        {isPicked && (
          <div className="absolute top-2 right-2 z-10">
            <div
              className="font-valorant text-xs font-bold px-2 py-1 rounded clip-corner-sm backdrop-blur-sm"
              style={{
                backgroundColor: teamColor ? `${teamColor}40` : '#ffffff20',
                color: teamColor ?? '#fff',
                border: `1px solid ${teamColor ?? '#fff'}60`,
              }}
            >
              MAP {map.pickOrder}
              {!map.pickedBy && <span className="ml-1">⚡</span>}
            </div>
          </div>
        )}

        {/* ── Side badge ── */}
        {isPicked && map.side && (
          <div className="absolute top-2 left-2 z-10">
            <div
              className={`
                font-valorant text-xs font-bold px-2 py-1 rounded backdrop-blur-sm
                ${map.side === 'attack' ? 'bg-orange-500/40 text-orange-200 border border-orange-500/60'
                  : 'bg-sky-500/40 text-sky-200 border border-sky-500/60'}
              `}
            >
              {map.side === 'attack' ? '⚔️ ATK' : '🛡️ DEF'}
            </div>
          </div>
        )}

        {/* ── Pick team banner (bottom) ── */}
        {isPicked && map.pickedBy && (
          <div
            className="absolute bottom-0 left-0 right-0 text-center py-1 font-ui text-xs font-semibold z-10 border-t border-white/5"
            style={{ backgroundColor: `${TEAM_COLORS[map.pickedBy]}60`, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}
          >
            {map.pickedBy === 'teamA' ? 'Team A' : 'Team B'}
          </div>
        )}

        {/* ── Map name ── */}
        <div className={`absolute left-0 right-0 px-3 z-10 ${isPicked && map.pickedBy ? 'bottom-7' : 'bottom-2'}`}>
          <div className={`font-valorant font-bold text-sm tracking-wider uppercase ${isBanned ? 'text-val-muted line-through' : 'text-val-text'}`}>
            {map.name}
          </div>
        </div>

        {/* ── Active turn border pulse ── */}
        {isClickable && (
          <div
            className="absolute inset-0 rounded border-2 pointer-events-none animate-pulse-red z-20"
            style={{ borderColor: canBan ? '#FF4655' : '#53B0F8' }}
          />
        )}
      </button>
    </div>
  );
}