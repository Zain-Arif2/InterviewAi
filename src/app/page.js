import Link from 'next/link';
import { ArrowRight, Sparkles, Target, BarChart3, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Nav */}
      <nav
        className="sticky top-0 z-50 glass"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
              InterviewAI
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-[var(--muted)]"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                boxShadow: '0 4px 20px -2px rgba(99, 102, 241, 0.4)',
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute top-1/2 -left-40 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium mb-6 animate-fade-in"
               style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <span>Next-gen AI Interview Coaching</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
              style={{ color: 'var(--foreground)' }}>
            Master your tech interviews with{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              real-time AI feedback
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl"
             style={{ color: 'var(--muted-foreground)' }}>
            Practice realistic behavioral and technical role-plays tailored specifically to your target job profile. Get actionable breakdowns on content and delivery.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:opacity-95"
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                boxShadow: '0 4px 25px -2px rgba(99, 102, 241, 0.4)',
              }}
            >
              Start Practicing Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="flex w-full sm:w-auto items-center justify-center rounded-xl border px-8 py-4 text-base font-semibold transition-colors duration-200 hover:bg-[var(--muted)]"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              Explore Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-2xl border p-6 transition-all duration-200 hover:shadow-md" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 mb-4">
              <Target className="h-6 w-6 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Custom Mock Scenarios</h3>
            <p style={{ color: 'var(--muted-foreground)' }} className="text-sm leading-relaxed">
              Generate interview contexts specific to company guidelines, seniority levels, or custom engineering criteria.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border p-6 transition-all duration-200 hover:shadow-md" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 mb-4">
              <BarChart3 className="h-6 w-6 text-violet-500" />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Granular Analytics</h3>
            <p style={{ color: 'var(--muted-foreground)' }} className="text-sm leading-relaxed">
              Track communication pacing, keyword alignment, context density scores, and complete architectural delivery maps.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border p-6 transition-all duration-200 hover:shadow-md sm:col-span-2 lg:col-span-1" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 mb-4">
              <Zap className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Instant Evaluation</h3>
            <p style={{ color: 'var(--muted-foreground)' }} className="text-sm leading-relaxed">
              Receive structured grading matching precise STAR-method metrics immediately following your session wrap-up.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}