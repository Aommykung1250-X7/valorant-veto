// ============================================================
// hooks/useRoom.ts — React hook: subscribe to Firebase room state
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import { subscribeToRoom } from '@/lib/roomActions';
import { RoomState } from '@/types';
import { buildInitialRoomState } from '@/lib/gameConstants';

export function useRoom() {
  const [roomState, setRoomState] = useState<RoomState>(buildInitialRoomState());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase; returns an unsubscribe function
    const unsubscribe = subscribeToRoom((state) => {
      setRoomState(state);
      setLoading(false);
    });

    return () => {
      unsubscribe(); // Cleanup listener on unmount
    };
  }, []);

  return { roomState, loading };
}
