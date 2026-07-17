import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { sanitizeInput } from '@/lib/utils';

const SALT_ROUNDS = 12;

/**
 * Get user by ID (excludes password).
 */
export async function getUserById(userId) {
  await connectDB();

  const user = await User.findById(userId).lean();
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  return {
    success: true,
    data: {
      ...user,
      _id: user._id.toString(),
      password: undefined,
    },
  };
}

/**
 * Get user by email (excludes password).
 */
export async function getUserByEmail(email) {
  await connectDB();

  const sanitizedEmail = sanitizeInput(email);
  const user = await User.findOne({ email: sanitizedEmail }).lean();
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  return {
    success: true,
    data: {
      ...user,
      _id: user._id.toString(),
      password: undefined,
    },
  };
}

/**
 * Update user profile.
 */
export async function updateProfile(userId, data) {
  await connectDB();

  const sanitizedData = sanitizeInput(data);

  const allowedFields = ['name', 'currentRole', 'experienceLevel', 'skills', 'targetJobRole'];
  const updateData = {};

  for (const field of allowedFields) {
    if (sanitizedData[field] !== undefined) {
      updateData[field] = sanitizedData[field];
    }
  }

  // Update avatar if name changed
  if (updateData.name) {
    updateData.image = `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(updateData.name)}&backgroundColor=6366f1`;
  }

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).lean();

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  return {
    success: true,
    data: {
      ...user,
      _id: user._id.toString(),
      password: undefined,
    },
  };
}

/**
 * Change user password.
 */
export async function changePassword(userId, currentPassword, newPassword) {
  await connectDB();

  const user = await User.findById(userId);
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  if (!user.password) {
    return { success: false, error: 'Password not set for this account' };
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return { success: false, error: 'Incorrect current password' };
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  user.password = hashedNewPassword;
  await user.save();

  return {
    success: true,
    message: 'Password updated successfully',
  };
}