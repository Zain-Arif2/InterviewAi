import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import VerificationToken from '@/models/VerificationToken';
import { sendVerificationEmail, sendPasswordResetEmail } from '@/services/email.service';
import { generateOTP, sanitizeInput } from '@/lib/utils';
import { OTP_EXPIRY_MS } from '@/lib/constants';

const SALT_ROUNDS = 12;

/**
 * Authenticate a user with email and password credentials.
 * This resolves the NextAuth validation error.
 */
export async function authenticateUser({ email, password }) {
  await connectDB();

  const sanitizedEmail = sanitizeInput(email);

  // Find user by email
const user = await User.findOne({ email: sanitizedEmail }).select('+password');
  if (!user || !user.password) {
    return null;
  }

  // Verify password match
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  // NextAuth expects an object containing user attributes
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role || 'user',
    image: user.image,
  };
}

/**
 * Register a new user.
 */
export async function registerUser({ name, email, password }) {
  await connectDB();

  const sanitizedEmail = sanitizeInput(email);
  const sanitizedName = sanitizeInput(name);

  // Check if user already exists
  const existingUser = await User.findOne({ email: sanitizedEmail });
  if (existingUser) {
    return { success: false, error: 'An account with this email already exists' };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Check if this email is the admin email
  const isAdmin = process.env.ADMIN_EMAIL && sanitizedEmail === process.env.ADMIN_EMAIL.toLowerCase();

  // Create user
  const user = await User.create({
    name: sanitizedName,
    email: sanitizedEmail,
    password: hashedPassword,
    role: isAdmin ? 'admin' : 'user',
    image: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(sanitizedName)}&backgroundColor=6366f1`,
  });

  // Generate and send verification OTP
  const otp = generateOTP();

  // Delete any existing verification tokens for this email
  await VerificationToken.deleteMany({
    email: sanitizedEmail,
    type: 'email-verification',
  });

  await VerificationToken.create({
    email: sanitizedEmail,
    token: otp,
    type: 'email-verification',
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
  });

  await sendVerificationEmail(sanitizedEmail, otp, sanitizedName);

  return {
    success: true,
    data: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    },
  };
}

/**
 * Verify a user's email.
 */
export async function verifyEmail(email, token) {
  await connectDB();

  const sanitizedEmail = sanitizeInput(email);

  const verificationToken = await VerificationToken.findOne({
    email: sanitizedEmail,
    token,
    type: 'email-verification',
  });

  if (!verificationToken) {
    return { success: false, error: 'Invalid or incorrect verification code' };
  }

  if (new Date() > verificationToken.expiresAt) {
    return { success: false, error: 'Verification code has expired' };
  }

  const user = await User.findOneAndUpdate(
    { email: sanitizedEmail },
    { emailVerified: new Date() },
    { new: true }
  );

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  await VerificationToken.deleteOne({ _id: verificationToken._id });

  return {
    success: true,
    message: 'Email verified successfully',
  };
}

/**
 * Resend email verification token.
 */
export async function resendVerificationEmailToken(email) {
  await connectDB();

  const sanitizedEmail = sanitizeInput(email);

  const user = await User.findOne({ email: sanitizedEmail });
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  if (user.emailVerified) {
    return { success: false, error: 'Email is already verified' };
  }

  const otp = generateOTP();

  await VerificationToken.deleteMany({
    email: sanitizedEmail,
    type: 'email-verification',
  });

  await VerificationToken.create({
    email: sanitizedEmail,
    token: otp,
    type: 'email-verification',
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
  });

  await sendVerificationEmail(sanitizedEmail, otp, user.name);

  return {
    success: true,
    message: 'Verification code sent successfully',
  };
}

/**
 * Request password reset link/token.
 */
export async function requestPasswordReset(email) {
  await connectDB();

  const sanitizedEmail = sanitizeInput(email);

  const user = await User.findOne({ email: sanitizedEmail });
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  const otp = generateOTP();

  await VerificationToken.deleteMany({
    email: sanitizedEmail,
    type: 'password-reset',
  });

  await VerificationToken.create({
    email: sanitizedEmail,
    token: otp,
    type: 'password-reset',
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
  });

  await sendPasswordResetEmail(sanitizedEmail, otp, user.name);

  return {
    success: true,
    message: 'Password reset code sent successfully',
  };
}

/**
 * Reset password using verification token.
 */
export async function resetPassword(email, token, newPassword) {
  await connectDB();

  const sanitizedEmail = sanitizeInput(email);

  const resetToken = await VerificationToken.findOne({
    email: sanitizedEmail,
    token,
    type: 'password-reset',
  });

  if (!resetToken) {
    return { success: false, error: 'Invalid or incorrect reset code' };
  }

  if (new Date() > resetToken.expiresAt) {
    return { success: false, error: 'Reset code has expired' };
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  const user = await User.findOneAndUpdate(
    { email: sanitizedEmail },
    { password: hashedPassword }
  );

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  await VerificationToken.deleteOne({ _id: resetToken._id });

  return {
    success: true,
    message: 'Password updated successfully',
  };
}