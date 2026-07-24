import { auth } from '@/lib/auth';
import { getUserById } from '@/services/user.service';
import { PLAN_LIMITS } from '@/lib/constants';
import { CheckCircle2 } from 'lucide-react';
import BillingActions from './billing-actions';

export const metadata = {
  title: 'Billing',
  robots: 'noindex, nofollow',
};

export default async function BillingPage() {
  const session = await auth();
  const userResult = await getUserById(session.user.id);
  const user = userResult.data;
  const isPro = user?.subscription?.plan === 'pro';

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Billing</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Manage your subscription plan.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <PlanCard
          name="Free"
          price="$0"
          current={!isPro}
          features={[`${PLAN_LIMITS.free.interviewsPerMonth} interviews / month`, 'Basic feedback', 'Interview history']}
        />
        <PlanCard
          name="Pro"
          price="$19/mo"
          current={isPro}
          highlighted
          features={['Unlimited interviews', 'Advanced analytics', 'Priority AI feedback']}
        />
      </div>

      <BillingActions isPro={isPro} />

      {isPro && user?.subscription?.stripeCurrentPeriodEnd && (
        <p className="text-xs text-center" style={{ color: 'var(--muted-foreground)' }}>
          Renews on {new Date(user.subscription.stripeCurrentPeriodEnd).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

function PlanCard({ name, price, current, highlighted, features }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: 'var(--card)',
        border: highlighted ? '2px solid var(--color-primary-500)' : '1px solid var(--border)',
        boxShadow: highlighted ? 'var(--shadow-glow)' : 'none',
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>{name}</h3>
        {current && (
          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: 'var(--color-primary-500)', color: '#fff' }}>
            Current
          </span>
        )}
      </div>
      <p className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>{price}</p>
      <ul className="space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
            <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: 'var(--color-success-600)' }} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}