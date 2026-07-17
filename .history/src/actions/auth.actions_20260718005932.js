'use server';

import { signIn, signOut } from '@/lib/auth';
import {
  registerUser,
  verifyEmail,
  resendVerificationOTP,
  forgotPassword,
  resetPassword,
} from '@/services/auth.service';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/validators/auth.validator';
import { checkRateLimit, getClientIP } from '@/services/rate-limit.service';
import { actionResponse } from '@/lib/utils';
import { headers } from 'next/headers';
import { AuthError } from 'next-auth';

/**
 * Rate limit wrapper for auth actions.
 */
async function withRateLimit(action) {
  const headersList = await headers();
  const ip = getClientIP(headersList);
  const { success } = await checkRateLimit(ip, 'AUTH');

  if (!success) {
    return actionResponse(false, null, 'Too many requests. Please try again later.');
  }

  return action();
}

/**
 * Register a new user.
 */
export async function registerAction(formData) {
  return withRateLimit(async () => {
    try {
      const validation = registerSchema.safeParse(formData);
      if (!validation.success) {
        return actionResponse(false, null, validation.error.errors[0].message);
      }

      const result = await registerUser(validation.data);
      return result.success
        ? actionResponse(true, result.data)
        : actionResponse(false, null, result.error);
    } catch (error) {
      console.error('Register action error:', error);
      return actionResponse(false, null, 'Something went wrong. Please try again.');
    }
  });
}

/**
 * Login with credentials.
 */
export async function loginAction(formData) {
  return withRateLimit(async () => {
    try {
      const validation = loginSchema.safeParse(formData);
      if (!validation.success) {
        return actionResponse(false, null, validation.error.errors[0].message);
      }

      await signIn('credentials', {
        email: validation.data.email,
        password: validation.data.password,
        redirect: false,
      });

      return actionResponse(true, { message: 'Logged in successfully' });
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return actionResponse(false, null, 'Invalid credentials.');
          default:
            return actionResponse(false, null, 'Authentication failed.');
        }
      }
      console.error('Login action error:', error);
      return actionResponse(false, null, 'Something went wrong. Please try again.');
    }
  });
}

/**
 * Verify account using OTP code.
 */
export async function verifyEmailAction(formData) {
  return withRateLimit(async () => {
    try {
      const validation = verifyEmailSchema.safeParse(formData);
      if (!validation.success) {
        return actionResponse(false, null, validation.error.errors[0].message);
      }

      const result = await verifyEmail(validation.data);
      return result.success
        ? actionResponse(true, result.data)
        : actionResponse(false, null, result.error);
    } catch (error) {
      console.error('Verify email action error:', error);
      return actionResponse(false, null, 'Verification failed. Please try again.');
    }
  });
}

/**
 * Resend OTP code for email verification.
 */
export async function resendVerificationOTPAction(email) {
  return withRateLimit(async () => {
    try {
      if (!email) {
        return actionResponse(false, null, 'Email address is required.');
      }

      const result = await resendVerificationOTP(email);
      return result.success
        ? actionResponse(true, result.data)
        : actionResponse(false, null, result.error);
    } catch (error) {
      console.error('Resend OTP action error:', error);
      return actionResponse(false, null, 'Failed to send verification code.');
    }
  });
}

/**
 * Request password reset token / link.
 */
export async function forgotPasswordAction(formData) {
  return withRateLimit(async () => {
    try {
      const validation = forgotPasswordSchema.safeParse(formData);
      if (!validation.success) {
        return actionResponse(false, null, validation.error.errors[0].message);
      }

      const result = await forgotPassword(validation.data.email);
      return result.success
        ? actionResponse(true, result.data)
        : actionResponse(false, null, result.error);
    } catch (error) {
      console.error('Forgot password action error:', error);
      return actionResponse(false, null, 'Failed to process request.');
    }
  });
}

/**
 * Reset password using verification token.
 */
export async function resetPasswordAction(formData) {
  return withRateLimit(async () => {
    try {
      const validation = resetPasswordSchema.safeParse(formData);
      if (!validation.success) {
        return actionResponse(false, null, validation.error.errors[0].message);
      }

      const result = await resetPassword(validation.data);
      return result.success
        ? actionResponse(true, result.data)
        : actionResponse(false, null, result.error);
    } catch (error) {
      console.error('Reset password action error:', error);
      return actionResponse(false, null, 'Failed to update your password.');
    }
  });
}

/**
 * Sign out session handler.
 */
export async function logoutAction() {
  try {
    await signOut({ redirect: true, redirectTo: '/login' });
  } catch (error) {
    console.error('Logout action error:', error);
  }
}