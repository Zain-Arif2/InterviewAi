export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div>
        <div className="h-7 w-48 rounded-lg mb-2" style={{ background: 'var(--border)' }} />
        <div className="h-4 w-72 rounded-lg" style={{ background: 'var(--border)' }} />
      </div>

      {/* Stats skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 flex flex-col justify-between h-[134px]"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 w-28 rounded-lg" style={{ background: 'var(--border)' }} />
              <div className="h-9 w-9 rounded-xl" style={{ background: 'var(--border)' }} />
            </div>
            <div className="h-8 w-16 rounded-lg" style={{ background: 'var(--border)' }} />
          </div>
        ))}
      </div>

      {/* Content skeleton - Matches the 2-column action/activity layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Action Skeleton */}
        <div 
          className="rounded-2xl p-6 h-[220px] flex flex-col justify-between"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div>
            <div className="h-5 w-40 rounded-lg mb-3" style={{ background: 'var(--border)' }} />
            <div className="space-y-2">
              <div className="h-4 w-full rounded-lg" style={{ background: 'var(--border)' }} />
              <div className="h-4 w-[90%] rounded-lg" style={{ background: 'var(--border)' }} />
            </div>
          </div>
          <div className="h-10 w-36 rounded-xl" style={{ background: 'var(--border)' }} />
        </div>

        {/* Recent Activity Skeleton */}
        <div 
          className="rounded-2xl p-6 h-[220px] flex flex-col"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="h-5 w-32 rounded-lg mb-6" style={{ background: 'var(--border)' }} />
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="h-8 w-8 rounded-full mb-2" style={{ background: 'var(--border)' }} />
            <div className="h-4 w-64 rounded-lg" style={{ background: 'var(--border)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}