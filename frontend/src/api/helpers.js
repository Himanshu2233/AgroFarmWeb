/**
 * API Helpers
 * Common utilities for API error handling
 */

// Handle API errors consistently
export function handleApiError(error, defaultMessage = 'An error occurred') {
  const message = error.response?.data?.message || error.message || defaultMessage;
  
  // Log for debugging
  console.error('API Error:', {
    status: error.response?.status,
    message,
    url: error.config?.url,
  });
  
  throw new Error(message);
}

// Format error response
export function formatError(error) {
  return {
    message: error.response?.data?.message || error.message || 'Unknown error',
    status: error.response?.status || 500,
    data: error.response?.data || null,
  };
}

// Create FormData from object (for file uploads)
export function createFormData(data) {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, item));
      } else if (typeof value === 'object' && !(value instanceof File)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });
  
  return formData;
}

// Headers for FormData requests
export const FORMDATA_HEADERS = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};
