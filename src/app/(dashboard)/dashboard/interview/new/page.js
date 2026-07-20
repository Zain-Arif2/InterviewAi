'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Sparkles, Briefcase, User, MessageCircle } from 'lucide-react';
import { createInterviewAction } from '@/actions/interview.actions';
import { EXPERIENCE_LEVELS, INTERVIEW_TYPES } from '@/lib/constants';

export default function NewInterviewPage() {
  const router = useRouter();
  const [jobRole, setJobRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('mid');
  const [type, setType] = useState('technical');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!jobRole.trim()) {
      toast.error('Please enter a target job role');
      return;
    }

    setIsLoading(true);
    const result = await createInterviewAction({ jobRole, experienceLevel, type });

    if (result.success) {
      toast.success('Interview started!');
      router.push(`/dashboard/interview/${result.data.id}`);
    } else {
      toast.error(result.error || 'Failed to start interview');
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Start a New Interview</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Tell the AI a bit about the role you're preparing for.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--foreground)' }}>
            <Briefcase className="h-4 w-4" /> Target Job Role
          </label>
          <input
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            placeholder="e.g. Frontend Developer, Product Manager"
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
            style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--foreground)' }}>
            <User className="h-4 w-4" /> Experience Level
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {EXPERIENCE_LEVELS.map((lvl) => (
              <button
                key={lvl.value}
                type="button"
                onClick={() => setExperienceLevel(lvl.value)}
                className="rounded-xl px-3 py-2.5 text-xs font-medium transition-colors"
                style={{
                  background: experienceLevel === lvl.value ? 'var(--color-primary-500)' : 'var(--background)',
                  color: experienceLevel === lvl.value ? '#fff' : 'var(--foreground)',
                  border: '1px solid var(--border)',
                }}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--foreground)' }}>
            <MessageCircle className="h-4 w-4" /> Interview Type
          </label>
          <div className="grid gap-2 sm:grid-cols-3">
            {INTERVIEW_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className="rounded-xl p-3 text-left transition-colors"
                style={{
                  background: type === t.value ? 'var(--color-primary-50)' : 'var(--background)',
                  border: type === t.value ? '1px solid var(--color-primary-500)' : '1px solid var(--border)',
                }}
              >
                <p className="text-sm font-semibold" style={{ color: type === t.value ? 'var(--color-primary-600)' : 'var(--foreground)' }}>{t.label}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{t.description}</p>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))', boxShadow: 'var(--shadow-glow)' }}
        >
          {isLoading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Preparing your interview...</>) : (<><Sparkles className="h-4 w-4" /> Start Interview</>)}
        </button>
      </form>
    </div>
  );
}