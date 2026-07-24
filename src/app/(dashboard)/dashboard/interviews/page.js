'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { MessageSquare, Plus, Search } from 'lucide-react';
import { getUserInterviewsAction } from '@/actions/interview.actions';
import { INTERVIEW_TYPES } from '@/lib/constants';

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');

  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    const result = await getUserInterviewsAction({ search, type });
    if (result.success) {
      setInterviews(result.data.interviews);
    }
    setLoading(false);
  }, [search, type]);

  useEffect(() => {
    const timeout = setTimeout(fetchInterviews, 300);
    return () => clearTimeout(timeout);
  }, [fetchInterviews]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Interviews</h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>View and manage your interview history</p>
        </div>
        <Link
          href="/dashboard/interview/new"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))', boxShadow: 'var(--shadow-glow)' }}
        >
          <Plus className="h-4 w-4" />
          New Interview
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by job role..."
            className="w-full rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          />
        </div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-xl px-4 py-2.5 text-sm outline-none"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
        >
          <option value="">All types</option>
          {INTERVIEW_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'var(--muted)' }} />)}
        </div>
      ) : interviews.length ? (
        <div className="space-y-2">
          {interviews.map((interview) => (
            <Link
              key={interview.id}
              href={interview.status === 'completed' ? `/dashboard/interviews/${interview.id}` : `/dashboard/interview/${interview.id}`}
              className="flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-[var(--muted)]"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{interview.jobRole}</p>
                <p className="text-xs capitalize" style={{ color: 'var(--muted-foreground)' }}>{interview.type} · {interview.experienceLevel} · {new Date(interview.createdAt).toLocaleDateString()}</p>
              </div>
              {interview.status === 'completed' ? (
                <span className="text-sm font-semibold" style={{ color: 'var(--color-success-600)' }}>{interview.overallScore}%</span>
              ) : (
                <span className="text-xs font-medium rounded-full px-2.5 py-1" style={{ background: 'var(--color-warning-50)', color: 'var(--color-warning-600)' }}>In progress</span>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl p-12 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: 'var(--muted)' }}>
            <MessageSquare className="h-7 w-7" style={{ color: 'var(--muted-foreground)' }} />
          </div>
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--foreground)' }}>No interviews yet</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>Start your first AI-powered mock interview to practice and improve.</p>
          <Link
            href="/dashboard/interview/new"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))', boxShadow: 'var(--shadow-glow)' }}
          >
            <Plus className="h-4 w-4" />
            Start Interview
          </Link>
        </div>
      )}
    </div>
  );
}