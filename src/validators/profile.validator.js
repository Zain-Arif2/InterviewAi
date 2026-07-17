import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .trim(),
  currentRole: z
    .string()
    .max(100, 'Role must be at most 100 characters')
    .trim()
    .optional()
    .or(z.literal(''))
    .default(''),
  experienceLevel: z
    .enum(['', 'junior', 'mid', 'senior', 'lead'])
    .optional()
    .default(''),
  skills: z
    .array(z.string().trim())
    .max(20, 'Maximum 20 skills allowed')
    .optional()
    .default([]),
  targetJobRole: z
    .string()
    .max(100, 'Target role must be at most 100 characters')
    .trim()
    .optional()
    .or(z.literal(''))
    .default(''),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });