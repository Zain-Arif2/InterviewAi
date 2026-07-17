import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-lg text-center animate-fade-in">
        {/* Large 404 */}
        <div className="mb-6">
          <h1
            className="text-[120px] md:text-[150px] font-black leading-none tracking-tight gradient-text"
            style={{ lineHeight: 1 }}
          >
            404
          </h1>
        </div>

        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
          style={{ background: 'var(--muted)' }}
        >
          <Search className="h-7 w-7" style={{ color: 'var(--muted-foreground)' }} />
        </div>

        <h2 className="mb-2 text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
          Page Not Found
        </h2>
        <p className="mb-8 text-base" style={{ color: 'var(--muted-foreground)' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))',
            color: '#ffffff',
            boxShadow: 'var(--shadow-glow)',
          }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}