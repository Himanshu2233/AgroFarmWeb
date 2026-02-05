import { z } from 'zod';
import {
  emailSchema,
  passwordSchema as basePasswordSchema,
  strongPasswordSchema,
  nameSchema,
  phoneSchema,
  addressSchema,
  KATHMANDU_AREAS as AREAS,
} from './common.schema';

/**
 * Authentication Validation Schemas
 * Zod schemas for login, register, password reset, etc.
 */

// Re-export for backward compatibility
export const passwordSchema = basePasswordSchema;

// Login Schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Register Schema (simple with phone + optional address)
export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: strongPasswordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  address: addressSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Reset Password Schema
export const resetPasswordSchema = z.object({
  password: strongPasswordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Change Password Schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: strongPasswordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword'],
});

// Update Profile Schema (simple)
export const updateProfileSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  address: addressSchema,
});

// Re-export for backward compatibility
export const KATHMANDU_AREAS = AREAS;

// Export types for TypeScript compatibility
export const authSchemas = {
  login: loginSchema,
  register: registerSchema,
  forgotPassword: forgotPasswordSchema,
  resetPassword: resetPasswordSchema,
  changePassword: changePasswordSchema,
  updateProfile: updateProfileSchema,
};
