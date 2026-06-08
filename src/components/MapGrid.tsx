// ============================================================
// components/MapGrid.tsx — 7-map grid layout
// ============================================================

'use client';

import { MapState } from '@/types';
import { ActionType } from '@/types';
import MapCard from './MapCard';

interface Props {
  maps: Record<string, MapState>;
  isMyTurn: boolean;
  currentAction: ActionType;
  onBan: (mapId: string) => void;
  onPick: (mapId: string) => void;
}

// Fixed display order matching VCT official pool
const MAP_ORDER = ['ascent', 'breeze', 'fracture', 'haven', 'lotus', 'pearl', 'split'];

export default function MapGrid({ maps, isMyTurn, currentAction, onBan, onPick }: Props) {
  const orderedMaps = MAP_ORDER.map((id) => maps[id]).filter(Boolean);

  return (
    <div className="mt-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-val-border" />
        <span className="text-val-muted text-xs font-valorant tracking-[0.3em] uppercase">
          Map Pool · VCT Masters London 2026
        </span>
        <div className="h-px flex-1 bg-val-border" />
      </div>

      {/* 7 cards: 4 top + 3 bottom — centred */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">
        {orderedMaps.slice(0, 4).map((map, i) => (
          <MapCard
            key={map.id}
            map={map}
            index={i}
            isMyTurn={isMyTurn}
            currentAction={currentAction}
            onBan={onBan}
            onPick={onPick}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
        {orderedMaps.slice(4).map((map, i) => (
          <MapCard
            key={map.id}
            map={map}
            index={i + 4}
            isMyTurn={isMyTurn}
            currentAction={currentAction}
            onBan={onBan}
            onPick={onPick}
          />
        ))}
      </div>
    </div>
  );
}
