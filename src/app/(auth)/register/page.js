'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/validators/auth.validator';
import { registerAction } from '@/actions/auth.actions';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff, User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await registerAction(data);
      if (result.success) {
        toast.success('Account created! Please verify your email.');
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
        Create your account
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--muted-foreground)' }}>
        Start practicing interviews with AI coaching
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--muted-foreground)' }} />
            <input
              {...register('name')}
              id="name"
              type="text"
              placeholder="John Doe"
              disabled={isLoading}
              className="block w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: errors.name ? 'var(--destructive)' : 'var(--border)',
                color: 'var(--foreground)',
                '--tw-ring-color': 'var(--primary)',
              }}
            />
          </div>
          {errors.name && (
            <p className="mt-1.5 text-xs font-medium text-[var(--destructive)]">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--muted-foreground)' }} />
            <input
              {...register('email')}
              id="email"
              type="email"
              placeholder="name@example.com"
              disabled={isLoading}
              className="block w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: errors.email ? 'var(--destructive)' : 'var(--border)',
                color: 'var(--foreground)',
                '--tw-ring-color': 'var(--primary)',
              }}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs font-medium text-[var(--destructive)]">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--muted-foreground)' }} />
            <input
              {...register('password')}
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              disabled={isLoading}
              className="block w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: errors.password ? 'var(--destructive)' : 'var(--border)',
                color: 'var(--foreground)',
                '--tw-ring-color': 'var(--primary)',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs font-medium text-[var(--destructive)]">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors disabled:opacity-50"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Create account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium transition-colors hover:underline"
          style={{ color: 'var(--primary)' }}
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}