import { auth } from '@/lib/auth';
import { getDashboardStatsAction } from '@/actions/interview.actions';
import Link from 'next/link';
import {
  Sparkles, MessageSquare, TrendingUp, Target, ArrowRight, Clock,
} from 'lucide-react';

export const metadata = {
  title: 'Dashboard',
  robots: 'noindex, nofollow',
};

export default async function DashboardPage() {
  const session = await auth();
  const statsResult = await getDashboardStatsAction();
  const stats = statsResult.success ? statsResult.data : null;

  const statCards = [
    { label: 'Total Interviews', value: stats?.totalInterviews ?? 0, icon: MessageSquare },
    { label: 'Average Score', value: stats?.averageScore !== null && stats?.averageScore !== undefined ? `${stats.averageScore}%` : '—', icon: TrendingUp },
    { label: 'This Month', value: stats?.interviewsThisMonth ?? 0, icon: Clock },
    { label: 'Skills Tracked', value: (stats?.weakSkills?.length ?? 0) + (stats?.strongSkills?.length ?? 0), icon: Target },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
            Welcome back, {session?.user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Here's how your interview practice is going.
          </p>
        </div>
        <Link
          href="/dashboard/interview/new"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 w-fit"
          style={{ background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))', boxShadow: 'var(--shadow-glow)' }}
        >
          <Sparkles className="h-4 w-4" />
          Start New Interview
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'var(--muted)' }}>
              <stat.icon className="h-4 w-4" style={{ color: 'var(--color-primary-500)' }} />
            </div>
            <p className="text-2xl font-bold mb-0.5" style={{ color: 'var(--foreground)' }}>{stat.value}</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Recent Interviews</h2>
            <Link href="/dashboard/interviews" className="text-xs font-medium inline-flex items-center gap-1 hover:underline" style={{ color: 'var(--color-primary-500)' }}>
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {stats?.recentInterviews?.length ? (
            <div className="space-y-2">
              {stats.recentInterviews.map((interview) => (
                <Link
                  key={interview.id}
                  href={interview.status === 'completed' ? `/dashboard/interviews/${interview.id}` : `/dashboard/interview/${interview.id}`}
                  className="flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-[var(--muted)]"
                  style={{ border: '1px solid var(--border)' }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{interview.jobRole}</p>
                    <p className="text-xs capitalize" style={{ color: 'var(--muted-foreground)' }}>{interview.type} · {interview.experienceLevel}</p>
                  </div>
                  <div className="text-right">
                    {interview.status === 'completed' ? (
                      <span className="text-sm font-semibold" style={{ color: 'var(--color-success-600)' }}>{interview.overallScore}%</span>
                    ) : (
                      <span className="text-xs font-medium" style={{ color: 'var(--color-warning-600)' }}>In progress</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>No interviews yet. Start your first one to see it here.</p>
            </div>
          )}
        </div>

        <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Skills Overview</h2>

          <div className="mb-4">
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-success-600)' }}>Strong Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {stats?.strongSkills?.length ? (
                stats.strongSkills.map((skill) => (
                  <span key={skill} className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: 'var(--color-success-50)', color: 'var(--color-success-600)' }}>{skill}</span>
                ))
              ) : (
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>None yet</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-warning-600)' }}>Needs Improvement</p>
            <div className="flex flex-wrap gap-1.5">
              {stats?.weakSkills?.length ? (
                stats.weakSkills.map((skill) => (
                  <span key={skill} className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: 'var(--color-warning-50)', color: 'var(--color-warning-600)' }}>{skill}</span>
                ))
              ) : (
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>None yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}