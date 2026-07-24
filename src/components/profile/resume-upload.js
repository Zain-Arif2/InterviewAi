'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { FileText, Upload, X, Loader2, Sparkles } from 'lucide-react';
import { uploadResumeAction, getResumeSummaryAction, clearResumeAction } from '@/actions/resume.actions';

export function ResumeUpload() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    (async () => {
      const result = await getResumeSummaryAction();
      if (result.success && result.data?.skills?.length) {
        setResume(result.data);
      }
      setLoading(false);
    })();
  }, []);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    const result = await uploadResumeAction(formData);
    if (result.success) {
      setResume(result.data);
      toast.success('Resume analyzed! Your interviews will now be tailored to it.');
    } else {
      toast.error(result.error);
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  }

  async function handleRemove() {
    const result = await clearResumeAction();
    if (result.success) {
      setResume(null);
      toast.success('Resume removed');
    }
  }

  if (loading) {
    return <div className="h-24 rounded-xl animate-pulse" style={{ background: 'var(--muted)' }} />;
  }

  if (resume?.skills?.length) {
    return (
      <div className="rounded-xl p-4" style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" style={{ color: 'var(--color-primary-600)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{resume.fileName}</span>
          </div>
          <button onClick={handleRemove} className="text-xs font-medium hover:underline" style={{ color: 'var(--color-danger-600)' }}>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {resume.experienceSummary && (
          <p className="mb-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>{resume.experienceSummary}</p>
        )}

        <div className="flex flex-wrap gap-1.5">
          {resume.skills.map((skill) => (
            <span key={skill} className="rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}>
              {skill}
            </span>
          ))}
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-accent-500)' }}>
          <Sparkles className="h-3 w-3" />
          Your interviews are now tailored to this resume
        </p>
      </div>
    );
  }

  return (
    <label
      className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors hover:bg-[var(--muted)]"
      style={{ borderColor: 'var(--border)' }}
    >
      {uploading ? (
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--color-primary-500)' }} />
      ) : (
        <Upload className="h-6 w-6" style={{ color: 'var(--muted-foreground)' }} />
      )}
      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
        {uploading ? 'Analyzing your resume...' : 'Upload your resume (PDF)'}
      </p>
      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
        Interview questions will be tailored to your actual skills and experience
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
      />
    </label>
  );
}