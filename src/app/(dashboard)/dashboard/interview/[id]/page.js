'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Send, Loader2, CheckCircle2, Mic, MicOff } from 'lucide-react';
import { getInterviewAction, submitAnswerAction } from '@/actions/interview.actions';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { QUESTIONS_PER_INTERVIEW } from '@/lib/constants';

export default function InterviewChatPage() {
  const { id } = useParams();
  const router = useRouter();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [sending, setSending] = useState(false);
  const [completed, setCompleted] = useState(false);
  const bottomRef = useRef(null);
  const { isSupported, isListening, interimTranscript, error: micError, startListening, stopListening } = useSpeechRecognition();

  function handleToggleMic() {
    if (isListening) {
      stopListening();
      return;
    }
    startListening((finalText) => {
      setAnswer((prev) => (prev ? `${prev} ${finalText}` : finalText));
    });
  }

  useEffect(() => {
    if (micError) toast.error(micError);
  }, [micError]);

  useEffect(() => {
    (async () => {
      const result = await getInterviewAction(id);
      if (result.success) {
        setInterview(result.data);
        setCompleted(result.data.status === 'completed');
      } else {
        toast.error(result.error || 'Interview not found');
        router.push('/dashboard/interviews');
      }
      setLoading(false);
    })();
  }, [id, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [interview?.messages, sending]);

  async function handleSend(e) {
    e.preventDefault();
    if (!answer.trim() || sending) return;

    const userMessage = { role: 'user', content: answer };
    setInterview((prev) => ({ ...prev, messages: [...prev.messages, userMessage] }));
    setAnswer('');
    setSending(true);

    const result = await submitAnswerAction({ interviewId: id, answer: userMessage.content });

    if (result.success) {
      setInterview(result.data);
      if (result.data.completed) {
        setCompleted(true);
        toast.success('Interview complete! Here is your feedback.');
      }
    } else {
      toast.error(result.error || 'Failed to send answer');
    }

    setSending(false);
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--color-primary-500)' }} />
      </div>
    );
  }

  if (!interview) return null;

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col">
      <div className="mb-4 flex items-center justify-between rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{interview.jobRole}</p>
          <p className="text-xs capitalize" style={{ color: 'var(--muted-foreground)' }}>
            {interview.type} · {interview.experienceLevel}
          </p>
        </div>
        {!completed && (
          <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
            Question {Math.min(interview.questionCount, QUESTIONS_PER_INTERVIEW)} of {QUESTIONS_PER_INTERVIEW}
          </span>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        {interview.messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap"
              style={
                msg.role === 'user'
                  ? { background: 'var(--color-primary-500)', color: '#fff' }
                  : { background: 'var(--muted)', color: 'var(--foreground)' }
              }
            >
              {msg.content}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl px-4 py-2.5" style={{ background: 'var(--muted)' }}>
              <span className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ background: 'var(--muted-foreground)', animationDelay: '0ms' }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ background: 'var(--muted-foreground)', animationDelay: '150ms' }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ background: 'var(--muted-foreground)', animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {completed && (
          <InterviewReport interview={interview} />
        )}

        <div ref={bottomRef} />
      </div>

      {!completed && (
        <form onSubmit={handleSend} className="mt-4 flex flex-col gap-1.5">
          {isListening && (
            <p className="px-1 text-xs italic" style={{ color: 'var(--muted-foreground)' }}>
              {interimTranscript || 'Listening...'}
            </p>
          )}
          <div className="flex items-end gap-2">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Type your answer, or use the mic..."
              rows={2}
              disabled={sending}
              className="flex-1 resize-none rounded-xl px-4 py-3 text-sm outline-none disabled:opacity-60"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            />
            {isSupported && (
              <button
                type="button"
                onClick={handleToggleMic}
                disabled={sending}
                title={isListening ? 'Stop recording' : 'Speak your answer'}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors disabled:opacity-50"
                style={
                  isListening
                    ? { background: 'var(--color-danger-50)', color: 'var(--color-danger-600)' }
                    : { background: 'var(--muted)', color: 'var(--foreground)' }
                }
              >
                {isListening ? <MicOff className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
              </button>
            )}
            <button
              type="submit"
              disabled={sending || !answer.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))' }}
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function InterviewReport({ interview }) {
  return (
    <div className="rounded-2xl p-5 space-y-4" style={{ background: 'var(--color-primary-50)', border: '1px solid var(--color-primary-200)' }}>
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5" style={{ color: 'var(--color-success-600)' }} />
        <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Interview Complete</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <ScoreBlock label="Overall" value={interview.overallScore} />
        <ScoreBlock label="Technical" value={interview.technicalScore} />
        <ScoreBlock label="Communication" value={interview.communicationScore} />
      </div>

      {interview.summary && (
        <p className="text-sm" style={{ color: 'var(--foreground)' }}>{interview.summary}</p>
      )}

      {interview.strongSkills?.length > 0 && (
        <div>
          <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--color-success-600)' }}>Strong Points</p>
          <div className="flex flex-wrap gap-1.5">
            {interview.strongSkills.map((s) => (
              <span key={s} className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: 'var(--color-success-50)', color: 'var(--color-success-600)' }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {interview.weakSkills?.length > 0 && (
        <div>
          <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--color-warning-600)' }}>Areas to Improve</p>
          <div className="flex flex-wrap gap-1.5">
            {interview.weakSkills.map((s) => (
              <span key={s} className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: 'var(--color-warning-50)', color: 'var(--color-warning-600)' }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {interview.improvementTips?.length > 0 && (
        <div>
          <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Improvement Tips</p>
          <ul className="list-disc pl-4 space-y-1">
            {interview.improvementTips.map((tip, i) => (
              <li key={i} className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ScoreBlock({ label, value }) {
  return (
    <div className="rounded-xl p-3 text-center" style={{ background: 'var(--card)' }}>
      <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{value ?? '—'}%</p>
      <p className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
    </div>
  );
}