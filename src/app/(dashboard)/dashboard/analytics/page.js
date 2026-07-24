'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';
import { getAnalyticsAction } from '@/actions/interview.actions';

const ProgressChart = dynamic(() => import('./progress-chart'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] items-center justify-center">
      <Loader2 className="h-5 w-5 animate-spin" style={{ color: 'var(--color-primary-500)' }} />
    </div>
  ),
});
export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await getAnalyticsAction();
      if (result.success) setData(result.data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--color-primary-500)' }} />
      </div>
    );
  }

  if (!data?.totalInterviews) {
    return (
      <div className="rounded-2xl p-12 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--foreground)' }}>No data yet</h3>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Complete a few interviews to see your analytics here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Analytics</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Track your progress over time.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Interviews" value={data.totalInterviews} />
        <StatCard label="Average Score" value={`${data.averageScore}%`} />
        <ImprovementCard label="Technical Improvement" value={data.technicalImprovement} />
        <ImprovementCard label="Communication Improvement" value={data.communicationImprovement} />
      </div>

    <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
  <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Score Progress</h2>
  <ProgressChart data={data.progress} />
</div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <p className="text-2xl font-bold mb-0.5" style={{ color: 'var(--foreground)' }}>{value}</p>
      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
    </div>
  );
}

function ImprovementCard({ label, value }) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
  const color = isNeutral ? 'var(--muted-foreground)' : isPositive ? 'var(--color-success-600)' : 'var(--color-danger-600)';

  return (
    <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="mb-1 flex items-center gap-1.5">
        <Icon className="h-4 w-4" style={{ color }} />
        <p className="text-2xl font-bold" style={{ color }}>{isPositive ? '+' : ''}{value}</p>
      </div>
      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
    </div>
  );
}