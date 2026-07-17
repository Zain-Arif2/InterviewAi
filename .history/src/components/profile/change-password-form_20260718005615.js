'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema } from '@/validators/profile.validator';
import { changePasswordAction } from '@/actions/profile.actions';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff, Save } from 'lucide-react';

export function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await changePasswordAction(data);
      if (result.success) {
        toast.success('Password changed successfully');
        reset();
      } else {
        toast.error(result.error || 'Failed to change password');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Current Password */}
        <div className="sm:col-span-2">
          <label htmlFor="currentPassword" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            Current Password
          </label>
          <div className="relative max-w-md">
            <input
              id="currentPassword"
              type={showPasswords ? 'text' : 'password'}
              {...register('currentPassword')}
              className="w-full rounded-xl py-2.5 px-4 pr-12 text-sm outline-none transition-all duration-200 focus-ring"
              style={{
                background: 'var(--secondary)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-1.5 text-xs text-destructive">{errors.currentPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showPasswords ? 'text' : 'password'}
              {...register('newPassword')}
              className="w-full rounded-xl py-2.5 px-4 pr-12 text-sm outline-none transition-all duration-200 focus-ring"
              style={{
                background: 'var(--secondary)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              }}
            />
          </div>
          {errors.newPassword && (
            <p className="mt-1.5 text-xs text-destructive max-w-xs">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label htmlFor="confirmNewPassword" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmNewPassword"
              type={showPasswords ? 'text' : 'password'}
              {...register('confirmNewPassword')}
              className="w-full rounded-xl py-2.5 px-4 pr-12 text-sm outline-none transition-all duration-200 focus-ring"
              style={{
                background: 'var(--secondary)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              }}
            />
          </div>
          {errors.confirmNewPassword && (
            <p className="mt-1.5 text-xs text-destructive">{errors.confirmNewPassword.message}</p>
          )}
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90 disabled:opacity-50 group"
          style={{ background: 'var(--primary)' }}
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} className="transition-transform group-hover:scale-110" />
          )}
          Update Password
        </button>
      </div>
    </form>
  );
}