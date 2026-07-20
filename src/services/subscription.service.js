import connectDB from '@/lib/db';
import Interview from '@/models/Interview';
import User from '@/models/User';
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