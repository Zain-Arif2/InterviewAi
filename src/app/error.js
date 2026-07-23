'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function DashboardError({ error, reset }) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex h-[60vh] flex-col items-center justify-center text-center">
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{ background: 'var(--color-danger-50)' }}
      >
        <AlertTriangle className="h-6 w-6" style={{ color: 'var(--color-danger-600)' }} />
      </div>
      <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
        Something went wrong
      </h2>
      <p className="text-sm mb-6 max-w-sm" style={{ color: 'var(--muted-foreground)' }}>
        An unexpected error occurred while loading this page. You can try again, or head back to the dashboard.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))' }}
      >
        <RotateCcw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}