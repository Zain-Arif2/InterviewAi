import Link from 'next/link';
import { ArrowRight, Mic, RotateCcw, ClipboardCheck, ChevronDown } from 'lucide-react';
import { Testimonials } from '@/components/marketing/testimonials';

export const metadata = {
  title: 'InterviewAI — Rehearse the Interview, Not Just the Answers',
  description:
    'Practice realistic HR, technical, and behavioral interviews out loud with an AI that remembers where you struggled last time and pushes you to fix it. Free to start.',
  keywords: [
    'AI interview practice',
    'mock interview',
    'interview preparation',
    'technical interview practice',
    'behavioral interview practice',
    'AI interview coach',
  ],
  openGraph: {
    title: 'InterviewAI — Rehearse the Interview, Not Just the Answers',
    description:
      'Practice realistic HR, technical, and behavioral interviews out loud with an AI that remembers where you struggled last time.',
    type: 'website',
    siteName: 'InterviewAI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InterviewAI — Rehearse the Interview, Not Just the Answers',
    description:
      'Practice realistic HR, technical, and behavioral interviews out loud with an AI that remembers where you struggled last time.',
  },
};

const faqs = [
  {
    question: 'How does InterviewAI work?',
    answer:
      'You pick an interview type — HR, technical, or behavioral — and talk or type your way through it one question at a time. The AI interviewer responds in real time, adapts follow-up questions to what you said, and scores your answers when the session ends.',
  },
  {
    question: 'Can I practice by voice, or do I have to type?',
    answer:
      'Both work. You can speak your answers using your microphone or type them out — the interview flow and scoring are identical either way.',
  },
  {
    question: 'What does "it remembers last time" actually mean?',
    answer:
      'At the start of every new session, InterviewAI checks the specific skills or topics you struggled with in previous sessions and works them back into the questions, so you are practicing your actual weak spots instead of starting from zero each time.',
  },
  {
    question: 'What kind of feedback do I get after a session?',
    answer:
      'You get an overall score plus separate technical and communication scores, alongside stronger sample answers and concrete suggestions for what to improve before your next real interview.',
  },
  {
    question: 'Is InterviewAI free to use?',
    answer:
      'You can start practicing for free. Sign up to try a session and see the scoring and feedback firsthand.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-md" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'color-mix(in srgb, var(--background) 85%, transparent)' }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))' }}
            >
              <Mic className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold" style={{ color: 'var(--foreground)' }}>
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
              style={{ background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))', boxShadow: 'var(--shadow-glow)' }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — split: pitch on the left, a live rehearsal on the right */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium mb-6"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}
            >
              <span className="flex items-end gap-[2px] h-3">
                <span className="waveform-bar w-[2px] rounded-full" style={{ height: '100%', background: 'var(--color-primary-500)', animationDelay: '0ms' }} />
                <span className="waveform-bar w-[2px] rounded-full" style={{ height: '100%', background: 'var(--color-primary-500)', animationDelay: '150ms' }} />
                <span className="waveform-bar w-[2px] rounded-full" style={{ height: '100%', background: 'var(--color-primary-500)', animationDelay: '300ms' }} />
              </span>
              AI interview rehearsal, out loud
            </div>

            <h1 className="font-display max-w-lg text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl" style={{ color: 'var(--foreground)' }}>
              Rehearse the interview.
              <br />
              Not just the answers.
            </h1>

            <p className="mt-6 max-w-md text-lg leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              Talk or type through realistic HR, technical, and behavioral interviews with an AI that remembers where you struggled last time — and pushes you to fix it.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-95"
                style={{ background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))', boxShadow: 'var(--shadow-glow)' }}
              >
                Start practicing — free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center rounded-xl border px-7 py-3.5 text-sm font-semibold transition-colors duration-200 hover:bg-[var(--muted)]"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="relative">
            <div
              className="rounded-2xl p-5"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-elevated)' }}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Technical Interview · Mid-Level</span>
                <span className="font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>Q3 / 6</span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm" style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>
                    Last time you mentioned closures were tricky — want to walk me through one now?
                  </div>
                </div>

                <div className="flex justify-end">
                  <div
                    className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm text-white"
                    style={{ background: 'var(--color-accent-500)' }}
                  >
                    Sure — a closure is a function that remembers the variables from where it was created...
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-1">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ background: 'var(--color-accent-500)' }}
                  >
                    <Mic className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="flex items-end gap-[2px] h-3">
                    {[0, 150, 300, 450, 600].map((delay) => (
                      <span
                        key={delay}
                        className="waveform-bar w-[2px] rounded-full"
                        style={{ height: '100%', background: 'var(--color-accent-500)', animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>answered by voice</span>
                </div>
              </div>

              <div className="mt-5 flex gap-2 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                <div className="flex-1 rounded-xl p-3 text-center" style={{ background: 'var(--muted)' }}>
                  <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>91%</p>
                  <p className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>Technical</p>
                </div>
                <div className="flex-1 rounded-xl p-3 text-center" style={{ background: 'var(--muted)' }}>
                  <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>88%</p>
                  <p className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>Communication</p>
                </div>
              </div>
            </div>

            <div
              className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl opacity-40 blur-2xl"
              style={{ background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))' }}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <FeatureCard
            icon={Mic}
            title="Speak or type"
            description="Answer out loud with your mic, or type it out — the AI interviewer follows either way, one question at a time."
          />
          <FeatureCard
            icon={RotateCcw}
            title="It remembers last time"
            description="Every session opens by checking whether you've improved on the exact skills you struggled with before."
          />
          <FeatureCard
            icon={ClipboardCheck}
            title="A real breakdown, not just a score"
            description="Overall, technical, and communication scores — plus stronger sample answers and concrete tips to fix your weak spots."
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            People who rehearsed their way in
          </h2>
          <p className="mt-3 text-base" style={{ color: 'var(--muted-foreground)' }}>
            A few honest words from people who used InterviewAI before their real interview.
          </p>
        </div>

        <Testimonials />
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-20 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Frequently asked questions
          </h2>
          <p className="mt-3 text-base" style={{ color: 'var(--muted-foreground)' }}>
            Everything you need to know before your first session.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-3">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{ background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))' }}
                >
                  <Mic className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="font-display text-base font-bold" style={{ color: 'var(--foreground)' }}>
                  InterviewAI
                </span>
              </Link>
              <p className="text-sm leading-relaxed max-w-[220px]" style={{ color: 'var(--muted-foreground)' }}>
                Rehearse the interview, not just the answers.
              </p>
            </div>

            <FooterColumn
              title="Product"
              links={[
                { label: 'Get Started', href: '/register' },
                { label: 'Sign In', href: '/login' },
                { label: 'Pricing', href: '/pricing' },
              ]}
            />
            <FooterColumn
              title="Company"
              links={[
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ]}
            />
            <FooterColumn
              title="Legal"
              links={[
                { label: 'Privacy', href: '/privacy' },
                { label: 'Terms', href: '/terms' },
              ]}
            />
          </div>

          <div
            className="mt-10 flex flex-col gap-2 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
          >
            <span>&copy; {new Date().getFullYear()} InterviewAI. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div
      className="rounded-2xl border p-6 transition-all duration-200 hover:shadow-md"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
    >
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl mb-4"
        style={{ background: 'var(--color-primary-50)' }}
      >
        <Icon className="h-5 w-5" style={{ color: 'var(--color-primary-600)' }} />
      </div>
      <h3 className="font-display text-lg font-bold mb-2" style={{ color: 'var(--foreground)' }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{description}</p>
    </div>
  );
}

function FaqItem({ question, answer }) {
  return (
    <details className="group rounded-xl border px-5 py-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
        {question}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180" style={{ color: 'var(--muted-foreground)' }} />
      </summary>
      <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
        {answer}
      </p>
    </details>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>{title}</h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group/link relative inline-block text-sm transition-colors duration-200 hover:text-[var(--foreground)]"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {link.label}
              <span
                className="absolute bottom-0 left-0 h-px w-0 transition-all duration-200 group-hover/link:w-full"
                style={{ backgroundColor: 'var(--foreground)' }}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}