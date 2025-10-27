/**
 * Centralized environment configuration
 * Provides type-safe access to environment variables with validation
 */

/**
 * Get an environment variable with optional default value
 * @param key - Environment variable key
 * @param defaultValue - Default value if variable is not set
 * @throws Error if variable is required but not set
 */
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

/**
 * Application configuration object
 * All environment variables are accessed through this centralized config
 */
export const config = {
  /** API base URL */
  apiUrl: getEnvVar('VITE_API_URL', 'http://localhost:3000/api'),

  /** Current environment mode */
  environment: getEnvVar('MODE', 'development'),

  /** Is development mode */
  isDevelopment: import.meta.env.DEV,

  /** Is production mode */
  isProduction: import.meta.env.PROD,
} as const;
