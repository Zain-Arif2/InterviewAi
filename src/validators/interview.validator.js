import { z } from 'zod';

export const createInterviewSchema = z.object({
  jobRole: z.string().min(2, 'Job role must be at least 2 characters').max(100).trim(),
  experienceLevel: z.enum(['junior', 'mid', 'senior', 'lead'], {
    errorMap: () => ({ message: 'Please select a valid experience level' }),
  }),
  type: z.enum(['hr', 'technical', 'behavioral'], {
    errorMap: () => ({ message: 'Please select a valid interview type' }),
  }),
});

export const submitAnswerSchema = z.object({
  interviewId: z.string().min(1, 'Interview ID is required'),
  answer: z.string().min(1, 'Please type an answer before submitting').max(4000, 'Answer is too long'),
});