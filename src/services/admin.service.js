import connectDB from '@/lib/db';
import User from '@/models/User';
import Interview from '@/models/Interview';

export async function getAllUsers({ search = '', page = 1, limit = 15 } = {}) {
  await connectDB();

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(query),
  ]);

  return {
    success: true,
    data: {
      users: users.map((u) => ({ ...u, _id: u._id.toString() })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function toggleUserDisabled(userId, disabled) {
  await connectDB();

  const user = await User.findByIdAndUpdate(userId, { isDisabled: disabled }, { new: true });
  if (!user) return { success: false, error: 'User not found' };

  return { success: true, data: { isDisabled: user.isDisabled } };
}

export async function updateUserPlan(userId, plan) {
  await connectDB();

  if (!['free', 'pro'].includes(plan)) {
    return { success: false, error: 'Invalid plan' };
  }

  const user = await User.findByIdAndUpdate(userId, { 'subscription.plan': plan }, { new: true });
  if (!user) return { success: false, error: 'User not found' };

  return { success: true, data: { plan: user.subscription.plan } };
}

export async function getSystemStats() {
  await connectDB();

  const [totalUsers, proUsers, totalInterviews, completedInterviews] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ 'subscription.plan': 'pro' }),
    Interview.countDocuments({}),
    Interview.countDocuments({ status: 'completed' }),
  ]);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const interviewsThisMonth = await Interview.countDocuments({ createdAt: { $gte: startOfMonth } });

  return {
    success: true,
    data: {
      totalUsers,
      proUsers,
      freeUsers: totalUsers - proUsers,
      totalInterviews,
      completedInterviews,
      interviewsThisMonth,
    },
  };
}