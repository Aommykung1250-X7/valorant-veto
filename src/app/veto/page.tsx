// ============================================================
// app/veto/page.tsx — Main veto room (Server Component wrapper)
// ============================================================

import { Suspense } from 'react';
import VetoRoom from '@/components/VetoRoom';

export default function VetoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-val-darker flex items-center justify-center">
        <div className="text-val-muted font-valorant tracking-widest animate-pulse">LOADING ROOM...</div>
      </div>
    }>
      <VetoRoom />
    </Suspense>
  );
}
