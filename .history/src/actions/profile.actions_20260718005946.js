'use server';

import { auth } from '@/lib/auth';
import { updateProfile, changePassword } from '@/services/user.service';
import { updateProfileSchema, changePasswordSchema } from '@/validators/profile.validator';
import { actionResponse } from '@/lib/utils';

/**
 * Update user profile.
 */
export async function updateProfileAction(formData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return actionResponse(false, null, 'Unauthorized');
    }

    const validation = updateProfileSchema.safeParse(formData);
    if (!validation.success) {
      return actionResponse(false, null, validation.error.errors[0].message);
    }

    const result = await updateProfile(session.user.id, validation.data);
    return result.success
      ? actionResponse(true, result.data)
      : actionResponse(false, null, result.error);
  } catch (error) {
    console.error('Update profile action error:', error);
    return actionResponse(false, null, 'Something went wrong. Please try again.');
  }
}

/**
 * Change user password.
 */
export async function changePasswordAction(formData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return actionResponse(false, null, 'Unauthorized');
    }

    const validation = changePasswordSchema.safeParse(formData);
    if (!validation.success) {
      return actionResponse(false, null, validation.error.errors[0].message);
    }

    const result = await changePassword(
      session.user.id,
      validation.data.currentPassword,
      validation.data.newPassword
    );

    return result.success
      ? actionResponse(true, result.data)
      : actionResponse(false, null, result.error);
  } catch (error) {
    console.error('Change password action error:', error);
    return actionResponse(false, null, 'Something went wrong. Please try again.');
  }
}