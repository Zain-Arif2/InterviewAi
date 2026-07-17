'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '@/validators/auth.validator';
import { forgotPasswordAction } from '@/actions/auth.actions';
import { toast } from 'sonner';
import { Loader2, Mail, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await forgotPasswordAction(data);
      if (result.success) {
        toast.success('Reset code sent! Check your email.');
        router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
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
      <div
        className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl"
        style={{ background: 'var(--muted)' }}
      >
        <KeyRound className="h-7 w-7" style={{ color: 'var(--primary)' }} />
      </div>

      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
        Forgot password?
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--muted-foreground)' }}>
        Enter your email and we&apos;ll send you a reset code
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium mb-2" 
            style={{ color: 'var(--foreground)' }}
          >
            Email address
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-5 w-5" style={{ color: 'var(--muted-foreground)' }} />
            </div>
            <input
              {...register('email')}
              id="email"
              type="email"
              autoComplete="email"
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
              Send recovery email
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:underline"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}