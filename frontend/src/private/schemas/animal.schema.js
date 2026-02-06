import { z } from 'zod';
import { nameSchema, descriptionSchema, priceSchema, quantitySchema } from './common.schema';

/**
 * Animal Validation Schemas
 * Zod schemas for animal management (admin)
 */

// Create Animal Schema
export const createAnimalSchema = z.object({
  name: nameSchema.max(100, 'Name cannot exceed 100 characters'),
  description: descriptionSchema,
  age: z
    .string()
    .min(1, 'Age is required')
    .max(50, 'Age description cannot exceed 50 characters'),
  weight: z
    .string()
    .min(1, 'Weight is required')
    .max(50, 'Weight description cannot exceed 50 characters'),
  price: priceSchema(10000000),
  quantity: quantitySchema(1, 1000),
  emoji: z
    .string()
    .optional()
    .default('🐄'),
  image: z.any().optional(), // File validation handled separately
});

// Update Animal Schema (all fields optional)
export const updateAnimalSchema = createAnimalSchema.partial();

// Export types
export const animalSchemas = {
  create: createAnimalSchema,
  update: updateAnimalSchema,
};
