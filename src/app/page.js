'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Sparkles, 
  Target, 
  BarChart3, 
  Zap, 
  Menu, 
  X, 
  CheckCircle2, 
  MessageSquare, 
  ShieldCheck,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sliderRef = useRef(null);
  const currentYear = new Date().getFullYear();

  // Production-ready mock testimonial data
  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Senior Full-Stack Engineer",
      company: "Stripe",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
      content: "The system design loops here are scary accurate. The real-time evaluation caught that I wasn't deep-diving enough into caching configurations. Landed my dream role within weeks.",
      rating: 5
    },
    {
      name: "Arjun Mehta",
      role: "Next.js Architect",
      company: "Vercel Partner Network",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
      content: "I loved the custom mock scenarios. Being able to explicitly practice frontend routes alongside deep architecture metrics gave me absolute psychological conditioning.",
      rating: 5
    },
    {
      name: "Elena Rostova",
      role: "Software Engineering Graduate",
      company: "Tech Startup",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
      content: "As a recent grad, behavioral rounds completely terrified me. InterviewAI's modular STAR framework grading guided me to keep responses concise and impact-driven.",
      rating: 5
    },
    {
      name: "David Chen",
      role: "DevOps Lead",
      company: "CloudScale",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
      content: "Testing modern production environments inside Docker and understanding scaling mechanics was a breeze. Highly recommended for senior profiles.",
      rating: 5
    }
  ];

  // Auto Scroll Engine
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const autoPlay = setInterval(() => {
      const { scrollLeft, scrollWidth, clientWidth } = slider;
      
      // If reached the end, reset to start smoothly
      if (scrollLeft + clientWidth >= scrollWidth - 5) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        slider.scrollTo({ left: scrollLeft + clientWidth / 1.5, behavior: 'smooth' });
      }
    }, 4000); // Transitions automatically every 4 seconds

    return () => clearInterval(autoPlay);
  }, []);

  // Manual fallback controls
  const scroll = (direction) => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const offset = direction === 'left' ? -clientWidth / 1.5 : clientWidth / 1.5;
      sliderRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" style={{ background: 'var(--background)' }}>
      {/* Responsive Navigation */}
      <nav
        className="sticky top-0 z-50 glass backdrop-blur-md bg-background/80"
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

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-3">
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

          {/* Mobile Menu Toggle button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-xl text-muted-foreground hover:bg-[var(--muted)] hover:text-foreground focus:outline-none transition-colors duration-200"
              style={{ color: 'var(--foreground)' }}
            >
              <span className="sr-only">Toggle Main Menu</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {isMenuOpen && (
          <div 
            className="md:hidden border-b px-6 pt-2 pb-6 space-y-4 animate-fade-in bg-background"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex w-full items-center justify-center rounded-xl border py-3 text-sm font-semibold transition-colors duration-200 hover:bg-[var(--muted)]"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMenuOpen(false)}
                className="flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 text-center hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  boxShadow: '0 4px 20px -2px rgba(99, 102, 241, 0.4)',
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
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
            <div className="rounded-2xl border p-6 transition-all duration-200 hover:shadow-md" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 mb-4">
                <Target className="h-6 w-6 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Custom Mock Scenarios</h3>
              <p style={{ color: 'var(--muted-foreground)' }} className="text-sm leading-relaxed">
                Generate interview contexts specific to FAANG criteria, startup requirements, engineering stack, or custom management tracks.
              </p>
            </div>

            <div className="rounded-2xl border p-6 transition-all duration-200 hover:shadow-md" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 mb-4">
                <BarChart3 className="h-6 w-6 text-violet-500" />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Granular Analytics</h3>
              <p style={{ color: 'var(--muted-foreground)' }} className="text-sm leading-relaxed">
                Track precise communication delivery speed, vital keyword counts, sentiment patterns, and architectural accuracy insights.
              </p>
            </div>

            <div className="rounded-2xl border p-6 transition-all duration-200 hover:shadow-md sm:col-span-2 lg:col-span-1" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 mb-4">
                <Zap className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Instant Evaluation</h3>
              <p style={{ color: 'var(--muted-foreground)' }} className="text-sm leading-relaxed">
                Receive comprehensive grading metrics optimized around the industry-recognized STAR-method right when you wrap up.
              </p>
            </div>
          </div>
        </section>

        {/* Modern Auto-Testimonials Slider Section */}
        <section className="mx-auto max-w-7xl px-6 py-16 md:py-24 border-t relative" style={{ borderColor: 'var(--border)' }}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3" style={{ color: 'var(--foreground)' }}>
                Proven by Engineers Worldwide
              </h2>
              <p className="text-base font-normal max-w-2xl" style={{ color: 'var(--muted-foreground)' }}>
                See how modern developers utilize our adaptive environment to pass difficult real-world evaluation cycles.
              </p>
            </div>
            
            {/* Slider Navigation Buttons */}
            <div className="flex gap-2">
              <button 
                onClick={() => scroll('left')}
                className="p-2.5 rounded-xl border bg-card text-foreground hover:bg-[var(--muted)] transition-colors duration-200"
                style={{ borderColor: 'var(--border)' }}
                aria-label="Scroll Left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="p-2.5 rounded-xl border bg-card text-foreground hover:bg-[var(--muted)] transition-colors duration-200"
                style={{ borderColor: 'var(--border)' }}
                aria-label="Scroll Right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Slider Container with CSS Scroll Snap */}
          <div 
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 smooth-scroll"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((t, idx) => (
              <div 
                key={idx} 
                className="w-full sm:w-[450px] md:w-[400px] shrink-0 snap-start rounded-2xl border p-6 flex flex-col justify-between bg-card transition-all duration-300 hover:shadow-md"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
              >
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm italic leading-relaxed mb-6" style={{ color: 'var(--foreground)' }}>
                    "{t.content}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <img 
                    src={t.image} 
                    alt={t.name} 
                    className="h-10 w-10 rounded-full object-cover border"
                    style={{ borderColor: 'var(--border)' }}
                  />
                  <div>
                    <h4 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{t.name}</h4>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      {t.role} @ <span className="font-semibold text-indigo-500">{t.company}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SEO Long-form / How it works Section */}
        <section className="border-t py-16 md:py-24 bg-muted/30" style={{ borderColor: 'var(--border)' }}>
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4" style={{ color: 'var(--foreground)' }}>
                Why Practice Your Next Interview with AI?
              </h2>
              <p className="text-base" style={{ color: 'var(--muted-foreground)' }}>
                Traditional interview prep leaves you guessing. InterviewAI provides a data-driven blueprint to eliminate anxiety, polish communication structure, and land top-tier technical and engineering roles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-background" style={{ borderColor: 'var(--border)' }}>
                    <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1" style={{ color: 'var(--foreground)' }}>Structured STAR Framework Grading</h4>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                      Our AI engine automatically maps your behavioral responses to the Situation, Task, Action, and Result matrix, highlighting weak structural points instantly.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-background" style={{ borderColor: 'var(--border)' }}>
                    <MessageSquare className="h-5 w-5 text-violet-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1" style={{ color: 'var(--foreground)' }}>Real-Time System Design & Coding Contexts</h4>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                      Simulate high-stakes architectural loops. The mock framework evaluates how well you articulate scale, bottle-necks, data flows, and modern container orchestration patterns.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-background" style={{ borderColor: 'var(--border)' }}>
                    <ShieldCheck className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1" style={{ color: 'var(--foreground)' }}>Zero-stress Psychological Conditioning</h4>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                      Build persistent muscle memory. By practicing edge-case questions inside our adaptive simulation interface, real human-panel loops feel natural and systematic.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border p-8 bg-card shadow-sm space-y-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                <h3 className="text-xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
                  Tailored Simulations for Modern Engineering Specialties
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                  Whether you are testing capabilities across the complete JavaScript stack, structuring performance-optimized Next.js and React client UI routes, modeling Express.js backend services, deploying robust MongoDB structures, or debugging scalable infrastructure runtimes within complex Docker containers—our specialized contextual datasets generate hyper-realistic, role-specific prompts.
                </p>
                <div className="pt-2 border-t flex flex-wrap gap-2" style={{ borderColor: 'var(--border)' }}>
                  {['Software Engineer', 'Full-Stack Developer', 'Frontend Architect', 'DevOps Specialist'].map((tag) => (
                    <span key={tag} className="text-xs font-semibold px-2.5 py-1 rounded-md bg-muted text-muted-foreground" style={{ backgroundColor: 'var(--muted)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Production Level Modern Footer */}
      <footer className="border-t bg-card text-muted-foreground mt-auto" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 md:col-span-1">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-indigo-500 to-violet-500">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
                <span className="text-md font-bold text-foreground" style={{ color: 'var(--foreground)' }}>
                  InterviewAI
                </span>
              </Link>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                Elevate your professional trajectory using production-grade AI intelligence modeled to emulate exact human assessment paradigms.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3" style={{ color: 'var(--foreground)' }}>Product</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/features" className="hover:text-foreground transition-colors">Features & Matrix</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing Tiers</Link></li>
                <li><Link href="/scenarios" className="hover:text-foreground transition-colors">Mock Library</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3" style={{ color: 'var(--foreground)' }}>Resources</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Interview Guide Blog</Link></li>
                <li><Link href="/faq" className="hover:text-foreground transition-colors">System FAQ</Link></li>
                <li><Link href="/star-method" className="hover:text-foreground transition-colors">STAR Framework Prep</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3" style={{ color: 'var(--foreground)' }}>Legal</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t text-center text-xs flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
            <p>&copy; {currentYear} InterviewAI. All rights reserved.</p>
            <p className="text-muted-foreground/60">Designed for modern developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}