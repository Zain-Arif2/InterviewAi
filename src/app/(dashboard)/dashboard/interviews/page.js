import { auth } from '@/lib/auth';
import { MessageSquare, Plus, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Interviews',
  robots: 'noindex, nofollow',
};

// Assuming an interview interface or data model structure
interface Interview {
  id: string;
  title: string;
  role: string;
  createdAt: string;
  score?: number | string;
}

export default async function InterviewsPage() {
  const session = await auth();
  
  // Placeholder or dynamic fetch logic for real data implementation
  const interviews: Interview[] = []; 

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
            Interviews
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            View and manage your interview history
          </p>
        </div>
        <Link
          href="/dashboard/interviews/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 w-full sm:w-auto"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          }}
        >
          <Plus className="h-4 w-4" />
          New Interview
        </Link>
      </div>

      {/* Conditional Rendering based on History */}
      {interviews.length === 0 ? (
        /* Empty state */
        <div
          className="rounded-2xl p-12 text-center"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
          }}
        >
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: 'var(--muted)' }}
          >
            <MessageSquare className="h-7 w-7" style={{ color: 'var(--muted-foreground)' }} />
          </div>
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
            No interviews yet
          </h3>
          <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
            Start your first AI-powered mock interview to practice and improve.
          </p>
          <Link
            href="/dashboard/interviews/new"
            className="inline-flex items-center gap-2 text-sm font-medium transition-all hover:opacity-80"
            style={{ color: 'var(--primary)' }}
          >
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        /* List state if populated later */
        <div className="grid gap-4">
          {interviews.map((interview) => (
            <div
              key={interview.id}
              className="flex items-center justify-between p-5 rounded-2xl transition-all duration-200"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
                  <MessageSquare className="h-5 w-5" style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                    {interview.title || interview.role}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                    <Calendar className="h-3 w-3" />
                    {new Date(interview.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Score</span>
                  <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>
                    {interview.score || '—'}
                  </p>
                </div>
                <Link
                  href={`/dashboard/interviews/${interview.id}`}
                  className="p-2 rounded-xl border transition-all"
                  style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
                >
                  <ArrowRight className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}