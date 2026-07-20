'use server';

import { auth } from '@/lib/auth';
import {
  getAllUsers,
  toggleUserDisabled,
  updateUserPlan,
  getSystemStats,
} from '@/services/admin.service';
import { actionResponse } from '@/lib/utils';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Unauthorized' };
  if (session.user.role !== 'admin') return { ok: false, error: 'Forbidden: admin access required' };
  return { ok: true, session };
}

export async function getAllUsersAction(params = {}) {
  const check = await requireAdmin();
  if (!check.ok) return actionResponse(false, null, check.error);

  try {
    const result = await getAllUsers(params);
    return result.success ? actionResponse(true, result.data) : actionResponse(false, null, result.error);
  } catch (error) {
    console.error('Get all users action error:', error);
    return actionResponse(false, null, 'Failed to load users.');
  }
}

export async function toggleUserDisabledAction(userId, disabled) {
  const check = await requireAdmin();
  if (!check.ok) return actionResponse(false, null, check.error);

  try {
    const result = await toggleUserDisabled(userId, disabled);
    return result.success ? actionResponse(true, result.data) : actionResponse(false, null, result.error);
  } catch (error) {
    console.error('Toggle user disabled action error:', error);
    return actionResponse(false, null, 'Failed to update user.');
  }
}

export async function updateUserPlanAction(userId, plan) {
  const check = await requireAdmin();
  if (!check.ok) return actionResponse(false, null, check.error);

  try {
    const result = await updateUserPlan(userId, plan);
    return result.success ? actionResponse(true, result.data) : actionResponse(false, null, result.error);
  } catch (error) {
    console.error('Update user plan action error:', error);
    return actionResponse(false, null, 'Failed to update plan.');
  }
}

export async function getSystemStatsAction() {
  const check = await requireAdmin();
  if (!check.ok) return actionResponse(false, null, check.error);

  try {
    const result = await getSystemStats();
    return result.success ? actionResponse(true, result.data) : actionResponse(false, null, result.error);
  } catch (error) {
    console.error('Get system stats action error:', error);
    return actionResponse(false, null, 'Failed to load system stats.');
  }
}