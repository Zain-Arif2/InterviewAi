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
  const userResult = await getUserById(session?.user?.id);
  const user = userResult?.data;

  return (
    <div className="max-w-3xl space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
          Profile
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Manage your personal information and preferences
        </p>
      </div>

      {/* Profile Card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Banner */}
        <div
          className="h-24"
          style={{
            background: 'linear-gradient(135deg, #312e81, #4338ca, #6366f1)',
          }}
        />
        <div className="px-6 pb-6">
          {/* Avatar & Basic Info */}
          <div className="flex items-end gap-4 -mt-10 mb-6">
            <div
              className="h-20 w-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-md"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                border: '4px solid var(--card)',
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="mb-1">
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                {user?.name || 'User'}
                {user?.role === 'premium' && (
                  <Crown className="h-4 w-4 text-amber-500 fill-amber-500" />
                )}
              </h2>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {user?.email}
              </p>
            </div>
          </div>

          {/* Form Header */}
          <div className="flex items-center gap-3 mb-6 pt-2">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: 'var(--muted)' }}
            >
              <User className="h-5 w-5" style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h3 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
                Personal Information
              </h3>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                Update your name and account details
              </p>
            </div>
          </div>

          {/* Hydrated Profile Form */}
          <ProfileForm user={user} />
        </div>
      </div>

      {/* Change Password Card */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: 'var(--muted)' }}
          >
            <Lock className="h-5 w-5" style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <h3 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
              Security
            </h3>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Update your password to secure your account
            </p>
          </div>
        </div>

        <ChangePasswordForm />
      </div>
    </div>
  );
}