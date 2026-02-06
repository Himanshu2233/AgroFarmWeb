/**
 * Input validation utilities for backend
 */

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation - allows various formats
const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return emailRegex.test(email.trim());
};

/**
 * Validate phone number format
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  return phoneRegex.test(phone.trim());
};

/**
 * Validate password strength
 * Requirements: At least 8 chars, 1 uppercase, 1 lowercase, 1 number
 */
export const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  if (password.length < 8) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
};

/**
 * Validate required string field
 */
export const isValidString = (value, minLength = 1, maxLength = 255) => {
  if (!value || typeof value !== 'string') return false;
  const trimmed = value.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
};

/**
 * Validate number range
 */
export const isValidNumber = (value, min = 0, max = Infinity) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Sanitize string input (basic XSS prevention)
 */
export const sanitizeString = (value) => {
  if (!value || typeof value !== 'string') return '';
  return value
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

/**
 * Validate registration input
 */
export const validateRegistration = (data) => {
  const errors = [];
  
  if (!isValidString(data.name, 2, 100)) {
    errors.push('Name must be between 2 and 100 characters');
  }
  
  if (!isValidEmail(data.email)) {
    errors.push('Please provide a valid email address');
  }
  
  if (!isValidPassword(data.password)) {
    errors.push('Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number');
  }
  
  if (!isValidPhone(data.phone)) {
    errors.push('Please provide a valid phone number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate login input
 */
export const validateLogin = (data) => {
  const errors = [];
  
  if (!isValidEmail(data.email)) {
    errors.push('Please provide a valid email address');
  }
  
  if (!data.password || data.password.length < 1) {
    errors.push('Password is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate product input
 */
export const validateProduct = (data) => {
  const errors = [];
  
  if (!isValidString(data.name, 2, 100)) {
    errors.push('Product name must be between 2 and 100 characters');
  }
  
  if (!isValidNumber(data.price, 0.01)) {
    errors.push('Price must be a positive number');
  }
  
  if (!isValidNumber(data.stock, 0)) {
    errors.push('Stock must be a non-negative number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate booking input
 */
export const validateBooking = (data) => {
  const errors = [];
  
  if (!data.product_type || !['product', 'animal'].includes(data.product_type)) {
    errors.push('Product type must be "product" or "animal"');
  }
  
  if (!isValidNumber(data.product_id, 1)) {
    errors.push('Valid product ID is required');
  }
  
  if (!isValidNumber(data.quantity, 1)) {
    errors.push('Quantity must be at least 1');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidString,
  isValidNumber,
  sanitizeString,
  validateRegistration,
  validateLogin,
  validateProduct,
  validateBooking
};
