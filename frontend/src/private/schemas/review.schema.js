import { z } from 'zod';
import { commentSchema } from './common.schema';

/**
 * Review Validation Schemas
 * Zod schemas for product reviews
 */

// Review Schema
export const reviewSchema = z.object({
  rating: z
    .number({ invalid_type_error: 'Rating is required' })
    .min(1, 'Please select a rating')
    .max(5, 'Rating cannot exceed 5 stars'),
  comment: commentSchema,
});

// Review with Product ID (for API submission)
export const createReviewSchema = reviewSchema.extend({
  product_id: z
    .number({ invalid_type_error: 'Product ID is required' })
    .positive('Invalid product ID'),
});

// Export types
export const reviewSchemas = {
  review: reviewSchema,
  createReview: createReviewSchema,
};
