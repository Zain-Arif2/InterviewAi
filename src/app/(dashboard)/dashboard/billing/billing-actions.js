'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Sparkles, Settings } from 'lucide-react';
import { createCheckoutSessionAction, createBillingPortalSessionAction } from '@/actions/subscription.actions';

export default function BillingActions({ isPro }) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    const result = await createCheckoutSessionAction();
    if (result.success) {
      window.location.href = result.data.url;
    } else {
      toast.error(result.error);
      setLoading(false);
    }
  }

  async function handleManage() {
    setLoading(true);
    const result = await createBillingPortalSessionAction();
    if (result.success) {
      window.location.href = result.data.url;
    } else {
      toast.error(result.error);
      setLoading(false);
    }
  }

  if (isPro) {
    return (
      <button
        onClick={handleManage}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors disabled:opacity-60"
        style={{ background: 'var(--muted)', color: 'var(--foreground)' }}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings className="h-4 w-4" />}
        Manage Subscription
      </button>
    );
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
      style={{ background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))', boxShadow: 'var(--shadow-glow)' }}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
      Upgrade to Pro
    </button>
  );
}