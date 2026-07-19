import { BarChart3 } from 'lucide-react';

export const metadata = {
  title: 'Analytics',
  robots: 'noindex, nofollow',
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
          Analytics
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Track your interview performance and improvement over time
        </p>
      </div>

      <div
        className="rounded-2xl p-12 text-center"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
        }}
      >
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ background: 'var(--muted)' }}
        >
          <BarChart3 className="h-7 w-7" style={{ color: 'var(--muted-foreground)' }} />
        </div>
        <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
          No data yet
        </h3>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Complete interviews to see your analytics and progress charts here.
        </p>
      </div>
    </div>
  );
}