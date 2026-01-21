import { z } from 'zod';

/**
 * Common Validation Schemas & Constants
 * Reusable validation rules to avoid duplication
 */

// ================================
// REGEX PATTERNS
// ================================
export const REGEX_PATTERNS = {
  // Nepal phone: 10 digits starting with 97 or 98
  phone: /^(\+977)?[9][7-8][0-9]{8}$/,
  // Email pattern (basic)
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  // Password patterns
  hasLowerCase: /[a-z]/,
  hasUpperCase: /[A-Z]/,
  hasNumber: /[0-9]/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
};

// ================================
// VALIDATION CONSTANTS
// ================================
export const VALIDATION_LIMITS = {
  password: {
    minLength: 6,
    maxLength: 100,
  },
  name: {
    minLength: 2,
    maxLength: 50,
  },
  description: {
    minLength: 10,
    maxLength: 1000,
  },
  address: {
    maxLength: 500,
  },
  notes: {
    maxLength: 500,
  },
  message: {
    maxLength: 1000,
  },
  comment: {
    maxLength: 1000,
  },
};

// ================================
// REUSABLE ZOD SCHEMAS
// ================================

// Email validation
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

// Phone validation (Nepal)
export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(
    REGEX_PATTERNS.phone,
    'Please enter a valid Nepal phone number (98XXXXXXXX or 97XXXXXXXX)'
  );

// Password validation (basic - for login)
export const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(
    VALIDATION_LIMITS.password.minLength,
    `Password must be at least ${VALIDATION_LIMITS.password.minLength} characters`
  );

// Strong password validation (for registration/reset)
export const strongPasswordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(
    VALIDATION_LIMITS.password.minLength,
    `Password must be at least ${VALIDATION_LIMITS.password.minLength} characters`
  )
  .regex(REGEX_PATTERNS.hasLowerCase, 'Password must contain at least one lowercase letter')
  .regex(REGEX_PATTERNS.hasUpperCase, 'Password must contain at least one uppercase letter')
  .regex(REGEX_PATTERNS.hasNumber, 'Password must contain at least one number');

// Name validation
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .min(VALIDATION_LIMITS.name.minLength, `Name must be at least ${VALIDATION_LIMITS.name.minLength} characters`)
  .max(VALIDATION_LIMITS.name.maxLength, `Name must be less than ${VALIDATION_LIMITS.name.maxLength} characters`);

// Description validation
export const descriptionSchema = z
  .string()
  .min(1, 'Description is required')
  .min(
    VALIDATION_LIMITS.description.minLength,
    `Description must be at least ${VALIDATION_LIMITS.description.minLength} characters`
  )
  .max(
    VALIDATION_LIMITS.description.maxLength,
    `Description cannot exceed ${VALIDATION_LIMITS.description.maxLength} characters`
  );

// Address validation (optional)
export const addressSchema = z
  .string()
  .max(VALIDATION_LIMITS.address.maxLength, `Address must be less than ${VALIDATION_LIMITS.address.maxLength} characters`)
  .optional()
  .or(z.literal(''));

// Notes/Message validation (optional)
export const notesSchema = z
  .string()
  .max(VALIDATION_LIMITS.notes.maxLength, `Notes cannot exceed ${VALIDATION_LIMITS.notes.maxLength} characters`)
  .optional();

export const messageSchema = z
  .string()
  .max(VALIDATION_LIMITS.message.maxLength, `Message cannot exceed ${VALIDATION_LIMITS.message.maxLength} characters`)
  .optional();

// Comment validation (optional)
export const commentSchema = z
  .string()
  .max(VALIDATION_LIMITS.comment.maxLength, `Comment cannot exceed ${VALIDATION_LIMITS.comment.maxLength} characters`)
  .optional();

// Price validation
export const priceSchema = (maxPrice = 1000000) => z
  .number({ invalid_type_error: 'Price is required' })
  .positive('Price must be greater than 0')
  .max(maxPrice, `Price cannot exceed Rs. ${maxPrice.toLocaleString()}`);

// Quantity validation
export const quantitySchema = (min = 1, max = 1000) => z
  .number({ invalid_type_error: 'Quantity is required' })
  .int('Quantity must be a whole number')
  .min(min, `Quantity must be at least ${min}`)
  .max(max, `Quantity cannot exceed ${max}`);

// Date validation (not in past)
export const futureDateSchema = (errorMessage = 'Date cannot be in the past') => z
  .string()
  .min(1, 'Date is required')
  .refine((date) => {
    const selected = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
  }, errorMessage);

// ================================
// ENUM CONSTANTS
// ================================
export const ENUMS = {
  // Booking schedule types
  scheduleTypes: ['once', 'daily', 'weekly', 'monthly'],
  
  // Delivery/Contact times
  deliveryTimes: ['morning', 'afternoon', 'evening'],
  contactTimes: ['morning', 'afternoon', 'evening', 'anytime'],
  
  // Product categories
  productCategories: ['vegetables', 'fruits', 'dairy', 'grains', 'meat', 'other'],
  productUnits: ['per kg', 'per piece', 'per dozen', 'per liter', 'per bundle'],
  
  // User roles
  userRoles: ['customer', 'admin'],
  
  // Booking statuses
  bookingStatuses: ['pending', 'confirmed', 'completed', 'cancelled'],
};

// ================================
// LOCATION DATA
// ================================
export const KATHMANDU_AREAS = [
  'Kathmandu',
  'Lalitpur',
  'Bhaktapur',
  'Kirtipur',
  'Madhyapur Thimi',
  'Budhanilkantha',
  'Tokha',
  'Chandragiri',
  'Nagarjun',
  'Kageshwori Manohara',
  'Godawari',
  'Lubhu',
  'Dhulikhel',
  'Banepa',
];
