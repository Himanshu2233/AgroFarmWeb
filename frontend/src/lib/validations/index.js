/**
 * Validation Schemas - Central Export
 * All Zod schemas for form validation
 */

// Common Schemas & Constants (shared validation logic)
export * from './common.schema';

// Auth Schemas
export {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
  passwordSchema,
  KATHMANDU_AREAS,
  authSchemas,
} from './auth.schema';

// Booking Schemas
export {
  bookingSchema,
  animalEnquirySchema,
  bookingSchemas,
} from './booking.schema';

// Review Schemas
export {
  reviewSchema,
  createReviewSchema,
  reviewSchemas,
} from './review.schema';

// Product Schemas
export {
  createProductSchema,
  updateProductSchema,
  productSchemas,
} from './product.schema';

// Animal Schemas
export {
  createAnimalSchema,
  updateAnimalSchema,
  animalSchemas,
} from './animal.schema';
