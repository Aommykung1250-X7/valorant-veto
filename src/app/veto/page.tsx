'use client';

import { Suspense } from 'react';
import VetoRoom from '@/components/VetoRoom';

export default function VetoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-val-darker flex items-center justify-center">
        <div className="text-center">
          <div className="font-valorant text-2xl text-val-red animate-pulse tracking-widest mb-2">CONNECTING...</div>
          <div className="text-val-muted text-sm font-ui">Syncing with Firebase Realtime Database</div>
        </div>
      </div>
    }>
      <VetoRoom />
    </Suspense>
  );
}