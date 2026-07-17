import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  robots: 'noindex, nofollow',
};

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel — Form */}
      <div
        className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 xl:px-24"
        style={{ background: 'var(--background)' }}
      >
        {/* Logo */}
        <Link href="/" className="mb-10 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
            InterviewAI
          </span>
        </Link>

        <div className="w-full max-w-[420px] mx-auto lg:mx-0">
          {children}
        </div>
      </div>

      {/* Right Panel — Branded illustration */}
      <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b, #312e81, #4338ca)',
        }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute bottom-20 right-20 h-80 w-80 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-full bg-white/10 blur-xl" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Branding Content / Testimonial Card */}
        <div className="relative z-10 max-w-md px-8 text-center text-white">
          <blockquote className="text-xl font-medium leading-relaxed mb-6">
            &ldquo;This tool completely changed how I prepare. The AI feedback pinpointed exactly where my answers lacked depth, and I landed my dream software engineering role two weeks later.&rdquo;
          </blockquote>
          
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold text-base text-white">Sarah Jenkins</span>
            <span className="text-sm text-indigo-200">Software Engineer @ Stripe</span>
          </div>

          {/* Dots Indicator */}
          <div className="mt-8 flex justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white opacity-100" />
            <span className="h-1.5 w-1.5 rounded-full bg-white opacity-40" />
            <span className="h-1.5 w-1.5 rounded-full bg-white opacity-40" />
          </div>
        </div>
      </div>
    </div>
  );
}