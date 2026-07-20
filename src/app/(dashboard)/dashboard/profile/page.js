import { auth } from '@/lib/auth';
import { getUserById } from '@/services/user.service';
import { ProfileForm } from '@/components/profile/profile-form';
import { ChangePasswordForm } from '@/components/profile/change-password-form';
import { User, Lock, Crown } from 'lucide-react';

export const metadata = {
  title: 'Profile',
  robots: 'noindex, nofollow',
};

export default async function ProfilePage() {
  const session = await auth();
  const userResult = await getUserById(session.user.id);
  const user = userResult.data;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Profile</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Manage your personal information and account.</p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'var(--color-primary-50)' }}>
          <Crown className="h-5 w-5" style={{ color: 'var(--color-primary-500)' }} />
        </div>
        <div>
          <p className="text-sm font-semibold capitalize" style={{ color: 'var(--foreground)' }}>{user?.subscription?.plan || 'free'} Plan</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {user?.subscription?.plan === 'pro' ? 'Unlimited interviews' : 'Limited interviews per month'}
          </p>
        </div>
      </div>

      <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="mb-5 flex items-center gap-2">
          <User className="h-4 w-4" style={{ color: 'var(--foreground)' }} />
          <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Personal Information</h2>
        </div>
        <ProfileForm user={user} />
      </div>

      <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="mb-5 flex items-center gap-2">
          <Lock className="h-4 w-4" style={{ color: 'var(--foreground)' }} />
          <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Change Password</h2>
        </div>
        <ChangePasswordForm />
      </div>
    </div>
  );
}