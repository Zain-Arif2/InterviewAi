'use server';

import { auth } from '@/lib/auth';
import { createCheckoutSession, createBillingPortalSession } from '@/services/subscription.service';
import { actionResponse } from '@/lib/utils';

export async function createCheckoutSessionAction() {
  try {
    const session = await auth();
    if (!session?.user?.id) return actionResponse(false, null, 'Unauthorized');

    const url = await createCheckoutSession(session.user.id, session.user.email);
    return actionResponse(true, { url });
  } catch (error) {
    console.error('Create checkout session action error:', error);
    return actionResponse(false, null, 'Failed to start checkout. Please try again.');
  }
}

export async function createBillingPortalSessionAction() {
  try {
    const session = await auth();
    if (!session?.user?.id) return actionResponse(false, null, 'Unauthorized');

    const url = await createBillingPortalSession(session.user.id);
    return actionResponse(true, { url });
  } catch (error) {
    console.error('Create billing portal session action error:', error);
    return actionResponse(false, null, 'Failed to open billing portal.');
  }
}