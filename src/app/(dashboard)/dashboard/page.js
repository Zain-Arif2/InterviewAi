import { auth } from '@/lib/auth';
import { getUserById } from '@/services/user.service';
import { Sparkles, MessageSquare, TrendingUp, Target, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard',
  robots: 'noindex, nofollow',
};

export default async function DashboardPage() {
  const session = await auth();
  const userResult = await getUserById(session?.user?.id);
  const user = userResult?.data;

  const stats = [
    {
      label: 'Total Interviews',
      value: user?.interviewCount || 0,
      icon: MessageSquare,
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.1)',
    },
    {
      label: 'Average Score',
      value: '—',
      icon: TrendingUp,
      color: '#22c55e',
      bg: 'rgba(34, 197, 94, 0.1)',
    },
    {
      label: 'Interviews This Month',
      value: user?.monthlyInterviewCount || 0,
      icon: Target,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)',
    },
    {
      label: 'Current Streak',
      value: '—',
      icon: Sparkles,
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.1)',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
          Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Here&apos;s an overview of your interview progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-5 transition-all duration-300 hover:shadow-card animate-slide-up"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                {stat.label}
              </span>
              <div
                className="p-2 rounded-xl"
                style={{ backgroundColor: stat.bg, color: stat.color }}
              >
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Actions and Activity Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Action Card */}
        <div 
          className="rounded-2xl p-6 flex flex-col justify-between"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              Start a New Session
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
              Practice your skills with simulated technical and behavioral interviews tailored to your target roles.
            </p>
          </div>
          <Link
            href="/dashboard/interviews/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all bg-primary text-primary-foreground hover:opacity-90 w-full sm:w-auto self-start"
          >
            New Interview <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Recent Activity Card */}
        <div 
          className="rounded-2xl p-6"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
            Recent Activity
          </h2>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="h-8 w-8 mb-2" style={{ color: 'var(--muted-foreground)' }} />
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              No recent data available. Start an interview to see your history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}