'use server';

import { auth } from '@/lib/auth';
import { processResumeUpload, getResumeSummary, clearResumeSummary } from '@/services/resume.service';
import { actionResponse } from '@/lib/utils';

const MAX_FILE_SIZE = 4 * 1024 * 1024;

export async function uploadResumeAction(formData) {
  try {
    const session = await auth();
    if (!session?.user?.id) return actionResponse(false, null, 'Unauthorized');

    const file = formData.get('resume');
    if (!file || typeof file === 'string') {
      return actionResponse(false, null, 'Please select a PDF file to upload.');
    }

    if (file.type !== 'application/pdf') {
      return actionResponse(false, null, 'Only PDF files are supported.');
    }

    if (file.size > MAX_FILE_SIZE) {
      return actionResponse(false, null, 'File is too large. Please upload a PDF under 4MB.');
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await processResumeUpload(session.user.id, buffer, file.name);
    return result.success ? actionResponse(true, result.data) : actionResponse(false, null, result.error);
  } catch (error) {
    console.error('Upload resume action error:', error);
    return actionResponse(false, null, 'Failed to process resume. Please try again.');
  }
}

export async function getResumeSummaryAction() {
  try {
    const session = await auth();
    if (!session?.user?.id) return actionResponse(false, null, 'Unauthorized');

    const result = await getResumeSummary(session.user.id);
    return actionResponse(true, result.data);
  } catch (error) {
    console.error('Get resume summary action error:', error);
    return actionResponse(false, null, 'Failed to load resume.');
  }
}

export async function clearResumeAction() {
  try {
    const session = await auth();
    if (!session?.user?.id) return actionResponse(false, null, 'Unauthorized');

    await clearResumeSummary(session.user.id);
    return actionResponse(true, null);
  } catch (error) {
    console.error('Clear resume action error:', error);
    return actionResponse(false, null, 'Failed to remove resume.');
  }
}