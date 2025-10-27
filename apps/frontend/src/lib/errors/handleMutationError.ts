import axios from 'axios';

export interface MutationErrorResult {
  title: string;
  message: string;
}

/**
 * Centralized mutation error handler
 * Provides user-friendly error messages based on error type and HTTP status
 *
 * @param error - The error object (can be AxiosError, Error, or unknown)
 * @param context - Context describing the operation (e.g., "create route", "update airline")
 * @returns Object with title and message for display to user
 *
 * @example
 * ```ts
 * try {
 *   await createRoute.mutateAsync(data);
 * } catch (error) {
 *   const { title, message } = handleMutationError(error, "create route");
 *   toast.error(title, { description: message });
 * }
 * ```
 */
export function handleMutationError(
  error: unknown,
  context: string
): MutationErrorResult {
  // Handle Axios errors (API errors)
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status;
    const apiMessage = error.response?.data?.message || error.message;

    // 400 - Bad Request / Validation Error
    if (statusCode === 400) {
      return {
        title: 'Validation Error',
        message: apiMessage || 'Please check your input and try again',
      };
    }

    // 401 - Unauthorized
    if (statusCode === 401) {
      return {
        title: 'Unauthorized',
        message: 'Please log in to continue',
      };
    }

    // 403 - Forbidden
    if (statusCode === 403) {
      return {
        title: 'Access Denied',
        message: 'You do not have permission to perform this action',
      };
    }

    // 404 - Not Found
    if (statusCode === 404) {
      return {
        title: 'Not Found',
        message: apiMessage || 'The requested resource was not found',
      };
    }

    // 409 - Conflict (e.g., duplicate entry)
    if (statusCode === 409) {
      return {
        title: 'Conflict',
        message: apiMessage || 'This item already exists',
      };
    }

    // 422 - Unprocessable Entity
    if (statusCode === 422) {
      return {
        title: 'Validation Failed',
        message: apiMessage || 'The data provided could not be processed',
      };
    }

    // 500+ - Server Errors
    if (statusCode && statusCode >= 500) {
      return {
        title: 'Server Error',
        message: 'Something went wrong on our end. Please try again later',
      };
    }

    // Network error (no response)
    if (!error.response) {
      return {
        title: 'Network Error',
        message: 'Unable to connect to the server. Please check your connection',
      };
    }

    // Timeout
    if (error.code === 'ECONNABORTED') {
      return {
        title: 'Request Timeout',
        message: 'The request took too long. Please try again',
      };
    }

    // Generic Axios error
    return {
      title: `Failed to ${context}`,
      message: apiMessage,
    };
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return {
      title: `Failed to ${context}`,
      message: error.message || 'An unexpected error occurred',
    };
  }

  // Handle unknown errors
  return {
    title: `Failed to ${context}`,
    message: 'An unexpected error occurred. Please try again',
  };
}
