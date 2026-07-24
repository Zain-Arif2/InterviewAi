import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getSystemStats } from '@/services/admin.service';
import { Users, Crown, MessageSquare, CheckCircle2 } from 'lucide-react';
import AdminUsersTable from './admin-users-table';

export const metadata = {
  title: 'Admin Panel',
  robots: 'noindex, nofollow',
};

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== 'admin') {
    redirect('/dashboard');
  }

  const statsResult = await getSystemStats();
  const stats = statsResult.success ? statsResult.data : null;

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users },
    { label: 'Pro Users', value: stats?.proUsers ?? 0, icon: Crown },
    { label: 'Total Interviews', value: stats?.totalInterviews ?? 0, icon: MessageSquare },
    { label: 'Completed', value: stats?.completedInterviews ?? 0, icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Admin Panel</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Manage users and monitor system activity.</p>
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

      <AdminUsersTable />
    </div>
  );
}