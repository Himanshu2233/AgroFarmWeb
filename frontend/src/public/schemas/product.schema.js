import { z } from 'zod';
import { nameSchema, descriptionSchema, priceSchema, quantitySchema, ENUMS } from './common.schema';

/**
 * Product Validation Schemas
 * Zod schemas for product management (admin)
 */

// Create Product Schema
export const createProductSchema = z.object({
  name: nameSchema.max(100, 'Name cannot exceed 100 characters'),
  description: descriptionSchema,
  price: priceSchema(1000000),
  unit: z.enum(ENUMS.productUnits, {
    errorMap: () => ({ message: 'Please select a valid unit' }),
  }),
  stock: quantitySchema(0, 100000),
  category: z.enum(ENUMS.productCategories, {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
  emoji: z
    .string()
    .optional()
    .default('🌱'),
  image: z.any().optional(), // File validation handled separately
});

// Update Product Schema (all fields optional)
export const updateProductSchema = createProductSchema.partial();

// Export types
export const productSchemas = {
  create: createProductSchema,
  update: updateProductSchema,
};
