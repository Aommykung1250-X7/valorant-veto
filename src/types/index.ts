// ============================================================
// types/index.ts — All shared TypeScript types for the app
// ============================================================

export type Role = 'teamA' | 'teamB' | 'spectator';

export type MapStatus = 'available' | 'banned' | 'picked';

export type Side = 'attack' | 'defend';

export type ActionType =
  | 'ban'
  | 'pick_map'
  | 'pick_side'
  | 'auto_pick'      // Map 3 is auto-resolved
  | 'complete';      // Draft is fully done

export interface MapState {
  id: string;
  name: string;
  status: MapStatus;
  /** Which team banned this map, if banned */
  bannedBy?: 'teamA' | 'teamB';
  /** Which team picked this map, if picked */
  pickedBy?: 'teamA' | 'teamB';
  /** Order of the picked map (1 = Map 1, 2 = Map 2, 3 = Map 3) */
  pickOrder?: 1 | 2 | 3;
  /** Side chosen by the opposing team for this map */
  side?: Side;
  /** Which team chose the side for this map */
  sideChosenBy?: 'teamA' | 'teamB';
}

/**
 * The 9-step veto sequence for Bo3.
 * Each step defines whose turn it is and what they must do.
 */
export interface VetoStep {
  step: number;           // 1–9
  team: 'teamA' | 'teamB';
  action: ActionType;
  /** For pick_side / auto_pick: which picked map (1, 2, or 3) this side is for */
  forPickOrder?: 1 | 2 | 3;
  label: string;          // Human-readable description
}

/** The full room state stored in Firebase */
export interface RoomState {
  currentStep: number;    // 1–9; 10 means complete
  maps: Record<string, MapState>;
  /** True once all 9 steps are done */
  isComplete: boolean;
  /** Timestamp of last update (for display purposes) */
  lastUpdated: number;
}

/** Derived view-model for a single map card */
export interface MapCardProps {
  map: MapState;
  isMyTurn: boolean;
  currentAction: ActionType;
  onBan: (mapId: string) => void;
  onPick: (mapId: string) => void;
}
