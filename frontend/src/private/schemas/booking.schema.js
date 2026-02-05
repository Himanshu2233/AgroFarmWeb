import { z } from 'zod';
import { quantitySchema, futureDateSchema, notesSchema, messageSchema, ENUMS } from './common.schema';

/**
 * Booking Validation Schemas
 * Zod schemas for product bookings and animal enquiries
 */

// Product Booking Schema
export const bookingSchema = z.object({
  quantity: quantitySchema(1, 1000),
  schedule_type: z.enum(ENUMS.scheduleTypes, {
    errorMap: () => ({ message: 'Please select a valid schedule type' }),
  }),
  start_date: futureDateSchema('Start date cannot be in the past'),
  end_date: z.string().optional(),
  delivery_time: z.enum(ENUMS.deliveryTimes, {
    errorMap: () => ({ message: 'Please select a delivery time' }),
  }),
  notes: notesSchema,
}).refine((data) => {
  // End date validation for recurring schedules
  if (data.schedule_type !== 'once' && data.end_date) {
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    return end > start;
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['end_date'],
});

// Animal Enquiry Schema
export const animalEnquirySchema = z.object({
  quantity: quantitySchema(1, 100),
  preferred_date: z
    .string()
    .min(1, 'Preferred date is required')
    .refine((date) => {
      const selected = new Date(date);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return selected >= tomorrow;
    }, 'Preferred date must be at least tomorrow'),
  contact_time: z.enum(ENUMS.contactTimes, {
    errorMap: () => ({ message: 'Please select a contact time' }),
  }),
  message: messageSchema,
});

// Export types
export const bookingSchemas = {
  booking: bookingSchema,
  animalEnquiry: animalEnquirySchema,
};
