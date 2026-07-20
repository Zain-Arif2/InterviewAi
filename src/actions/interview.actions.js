'use server';

import { auth } from '@/lib/auth';
import {
  createInterview,
  submitAnswer,
  getInterviewById,
  getUserInterviews,
  getUserStats,
  getAnalyticsData,
} from '@/services/interview.service';
import { checkInterviewLimit } from '@/services/subscription.service';
import { createInterviewSchema, submitAnswerSchema } from '@/validators/interview.validator';
import { actionResponse } from '@/lib/utils';

export async function createInterviewAction(formData) {
  try {
    const session = await auth();
    if (!session?.user?.id) return actionResponse(false, null, 'Unauthorized');

    const validation = createInterviewSchema.safeParse(formData);
    if (!validation.success) return actionResponse(false, null, validation.error.errors[0].message);

    const limit = await checkInterviewLimit(session.user.id);
    if (!limit.allowed) {
      return actionResponse(false, null, `You've reached your free plan limit of ${limit.limit} interviews this month. Upgrade to Pro for unlimited interviews.`);
    }

    const result = await createInterview(session.user.id, validation.data);
    return result.success ? actionResponse(true, result.data) : actionResponse(false, null, result.error);
  } catch (error) {
    console.error('Create interview action error:', error);
    return actionResponse(false, null, 'Failed to start interview. Please try again.');
  }
}

export async function submitAnswerAction(formData) {
  try {
    const session = await auth();
    if (!session?.user?.id) return actionResponse(false, null, 'Unauthorized');

    const validation = submitAnswerSchema.safeParse(formData);
    if (!validation.success) return actionResponse(false, null, validation.error.errors[0].message);

    const result = await submitAnswer(validation.data.interviewId, session.user.id, validation.data.answer);

    return result.success
      ? actionResponse(true, { ...result.data, completed: result.completed })
      : actionResponse(false, null, result.error);
  } catch (error) {
    console.error('Submit answer action error:', error);
    return actionResponse(false, null, 'Failed to submit answer. Please try again.');
  }
}

export async function getInterviewAction(interviewId) {
  try {
    const session = await auth();
    if (!session?.user?.id) return actionResponse(false, null, 'Unauthorized');

    const result = await getInterviewById(interviewId, session.user.id);
    return result.success ? actionResponse(true, result.data) : actionResponse(false, null, result.error);
  } catch (error) {
    console.error('Get interview action error:', error);
    return actionResponse(false, null, 'Failed to load interview.');
  }
}

export async function getUserInterviewsAction(params = {}) {
  try {
    const session = await auth();
    if (!session?.user?.id) return actionResponse(false, null, 'Unauthorized');

    const result = await getUserInterviews(session.user.id, params);
    return result.success ? actionResponse(true, result.data) : actionResponse(false, null, result.error);
  } catch (error) {
    console.error('Get user interviews action error:', error);
    return actionResponse(false, null, 'Failed to load interview history.');
  }
}

export async function getDashboardStatsAction() {
  try {
    const session = await auth();
    if (!session?.user?.id) return actionResponse(false, null, 'Unauthorized');

    const result = await getUserStats(session.user.id);
    return result.success ? actionResponse(true, result.data) : actionResponse(false, null, result.error);
  } catch (error) {
    console.error('Get dashboard stats action error:', error);
    return actionResponse(false, null, 'Failed to load dashboard stats.');
  }
}

export async function getAnalyticsAction() {
  try {
    const session = await auth();
    if (!session?.user?.id) return actionResponse(false, null, 'Unauthorized');

    const result = await getAnalyticsData(session.user.id);
    return result.success ? actionResponse(true, result.data) : actionResponse(false, null, result.error);
  } catch (error) {
    console.error('Get analytics action error:', error);
    return actionResponse(false, null, 'Failed to load analytics.');
  }
}