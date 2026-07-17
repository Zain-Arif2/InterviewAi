'use client';

import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({ error, reset }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ background: 'var(--background)' }}>
      <div
        className="w-full max-w-md rounded-2xl p-8 text-center animate-fade-in"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-elevated)',
        }}
      >
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
          style={{ background: 'var(--destructive)', opacity: 0.1 }}
        >
          <AlertTriangle className="h-7 w-7" style={{ color: 'var(--destructive)' }} />
        </div>
        <h2 className="mb-2 text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
          Something went wrong
        </h2>
        <p className="mb-6 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:opacity-90 cursor-pointer"
            style={{
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200"
            style={{
              background: 'var(--secondary)',
              color: 'var(--secondary-foreground)',
            }}
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}