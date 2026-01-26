/**
 * API Helper Functions
 * Reusable utilities for API calls
 */

/**
 * Create FormData from object (for file uploads)
 * @param {Object} data - Data to convert to FormData
 * @returns {FormData}
 */
export const createFormData = (data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  
  return formData;
};

/**
 * Handle API error and throw formatted error
 * @param {Error} error - Axios error object
 * @param {string} defaultMessage - Default error message
 * @throws {Object} Formatted error object
 */
export const handleApiError = (error, defaultMessage = 'Operation failed') => {
  throw error.response?.data || { message: defaultMessage };
};

/**
 * FormData headers for file uploads
 */
export const FORMDATA_HEADERS = {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
};
