import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { auth } from '@/lib/auth';
import { getInterviewById } from '@/services/interview.service';

export const metadata = {
  title: 'Interview Report',
  robots: 'noindex, nofollow',
};

export default async function InterviewReportPage({ params }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) notFound();

  const result = await getInterviewById(id, session.user.id);
  if (!result.success) notFound();

  const interview = result.data;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/dashboard/interviews"
        className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
        style={{ color: 'var(--muted-foreground)' }}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to interviews
      </Link>

      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>{interview.jobRole}</h1>
        <p className="text-sm capitalize" style={{ color: 'var(--muted-foreground)' }}>
          {interview.type} interview · {interview.experienceLevel} level · {new Date(interview.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <ScoreCard label="Overall Score" value={interview.overallScore} />
        <ScoreCard label="Technical" value={interview.technicalScore} />
        <ScoreCard label="Communication" value={interview.communicationScore} />
      </div>

      {interview.summary && (
        <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" style={{ color: 'var(--color-success-600)' }} />
            <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Summary</h2>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{interview.summary}</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <SkillBlock title="Strong Points" skills={interview.strongSkills} color="success" />
        <SkillBlock title="Areas to Improve" skills={interview.weakSkills} color="warning" />
      </div>

      {interview.betterAnswers?.length > 0 && (
        <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Better Sample Answers</h2>
          <div className="space-y-2">
            {interview.betterAnswers.map((a, i) => (
              <p key={i} className="rounded-xl p-3 text-sm" style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>{a}</p>
            ))}
          </div>
        </div>
      )}

      {interview.improvementTips?.length > 0 && (
        <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Improvement Tips</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            {interview.improvementTips.map((tip, i) => (
              <li key={i} className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Full Transcript</h2>
        <div className="space-y-3">
          {interview.messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className="max-w-[85%] rounded-xl px-3.5 py-2 text-sm whitespace-pre-wrap"
                style={msg.role === 'user' ? { background: 'var(--color-primary-500)', color: '#fff' } : { background: 'var(--muted)', color: 'var(--foreground)' }}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ label, value }) {
  return (
    <div className="rounded-2xl p-4 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{value ?? '—'}%</p>
      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
    </div>
  );
}

function SkillBlock({ title, skills, color }) {
  const bg = color === 'success' ? 'var(--color-success-50)' : 'var(--color-warning-50)';
  const fg = color === 'success' ? 'var(--color-success-600)' : 'var(--color-warning-600)';

  return (
    <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <p className="text-xs font-medium mb-2" style={{ color: fg }}>{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {skills?.length ? (
          skills.map((s) => (
            <span key={s} className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: bg, color: fg }}>{s}</span>
          ))
        ) : (
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>None noted</p>
        )}
      </div>
    </div>
  );
}