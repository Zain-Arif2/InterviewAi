import connectDB from '@/lib/db';
import Interview from '@/models/Interview';
import User from '@/models/User';
import { stripe } from '@/lib/stripe';
import { PLAN_LIMITS } from '@/lib/constants';

export async function checkInterviewLimit(userId) {
  await connectDB();

  const user = await User.findById(userId);
  if (!user) {
    return { allowed: false, remaining: 0, plan: 'free', limit: 0 };
  }

  const plan = user.subscription?.plan || 'free';
  const limit = PLAN_LIMITS[plan]?.interviewsPerMonth;

  if (limit === undefined || limit === null || limit === Infinity) {
    return { allowed: true, remaining: Infinity, plan, limit: Infinity };
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const usedThisMonth = await Interview.countDocuments({
    user: userId,
    createdAt: { $gte: startOfMonth },
  });

  const remaining = Math.max(0, limit - usedThisMonth);

  return { allowed: remaining > 0, remaining, plan, limit, used: usedThisMonth };
}
export async function createCheckoutSession(userId, userEmail) {
  await connectDB();

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  let customerId = user.subscription?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: userEmail,
      metadata: { userId: userId.toString() },
    });
    customerId = customer.id;
    user.subscription.stripeCustomerId = customerId;
    await user.save();
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
    metadata: { userId: userId.toString() },
  });

  return session.url;
}

export async function createBillingPortalSession(userId) {
  await connectDB();

  const user = await User.findById(userId);
  if (!user?.subscription?.stripeCustomerId) {
    throw new Error('No billing account found for this user');
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.subscription.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
  });

  return session.url;
}

export async function handleStripeWebhookEvent(event) {
  await connectDB();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      if (!userId) break;

      const subscription = await stripe.subscriptions.retrieve(session.subscription);

      await User.findByIdAndUpdate(userId, {
        'subscription.plan': 'pro',
        'subscription.stripeSubscriptionId': subscription.id,
        'subscription.stripePriceId': subscription.items.data[0].price.id,
        'subscription.stripeCurrentPeriodEnd': new Date(subscription.current_period_end * 1000),
      });
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      const user = await User.findOne({ 'subscription.stripeCustomerId': subscription.customer });
      if (!user) break;

      user.subscription.stripeCurrentPeriodEnd = new Date(subscription.current_period_end * 1000);
      user.subscription.plan = subscription.status === 'active' ? 'pro' : 'free';
      await user.save();
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const user = await User.findOne({ 'subscription.stripeCustomerId': subscription.customer });
      if (!user) break;

      user.subscription.plan = 'free';
      user.subscription.stripeSubscriptionId = null;
      user.subscription.stripePriceId = null;
      await user.save();
      break;
    }

    default:
      break;
  }
}