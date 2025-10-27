import { config } from "@/config/env";

/**
 * Log levels in order of severity
 */
export const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
} as const;

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

/**
 * Log context for additional metadata
 */
interface LogContext {
  [key: string]: unknown;
}

/**
 * Logger configuration
 */
interface LoggerConfig {
  /** Minimum log level to output (default: INFO in production, DEBUG in development) */
  minLevel: LogLevel;

  /** Whether to enable console output (default: true) */
  enableConsole: boolean;

  /** Whether to include timestamps (default: true) */
  includeTimestamp: boolean;
}

/**
 * Default logger configuration
 */
const defaultConfig: LoggerConfig = {
  minLevel: config.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO,
  enableConsole: true,
  includeTimestamp: true,
};

class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Format log message with timestamp and level
   */
  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = this.config.includeTimestamp
      ? new Date().toISOString()
      : "";
    const levelName = Object.keys(LogLevel).find(
      (key) => LogLevel[key as keyof typeof LogLevel] === level
    );

    return timestamp
      ? `[${timestamp}] [${levelName}] ${message}`
      : `[${levelName}] ${message}`;
  }

  /**
   * Check if log level should be output
   */
  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.minLevel;
  }

  /**
   * Output log to console
   */
  output(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): void {
    if (!this.config.enableConsole || !this.shouldLog(level)) {
      return;
    }

    const formattedMessage = this.formatMessage(level, message);

    // Choose appropriate console method based on level
    const consoleMethod = {
      [LogLevel.DEBUG]: console.debug,
      [LogLevel.INFO]: console.info,
      [LogLevel.WARN]: console.warn,
      [LogLevel.ERROR]: console.error,
    }[level];

    // Output message with context and error if available
    if (context && error) {
      consoleMethod(formattedMessage, context, error);
    } else if (context) {
      consoleMethod(formattedMessage, context);
    } else if (error) {
      consoleMethod(formattedMessage, error);
    } else {
      consoleMethod(formattedMessage);
    }
  }

  /**
   * Log debug message (only in development)
   */
  debug(message: string, context?: LogContext): void {
    this.output(LogLevel.DEBUG, message, context);
  }

  /**
   * Log info message
   */
  info(message: string, context?: LogContext): void {
    this.output(LogLevel.INFO, message, context);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    this.output(LogLevel.WARN, message, context);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error, context?: LogContext): void {
    this.output(LogLevel.ERROR, message, context, error);
  }

  /**
   * Update logger configuration
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

/**
 * Global logger instance
 * Use this throughout the application for consistent logging
 *
 * @example
 * ```tsx
 * import { logger } from '@/lib/logger';
 *
 * // Debug logging (only in development)
 * logger.debug('Component mounted', { componentName: 'AirportList' });
 *
 * // Info logging
 * logger.info('User logged in', { userId: '123' });
 *
 * // Warning logging
 * logger.warn('API rate limit approaching', { remaining: 10 });
 *
 * // Error logging
 * try {
 *   throw new Error('Something went wrong');
 * } catch (error) {
 *   logger.error('Operation failed', error as Error, { operation: 'createAirport' });
 * }
 * ```
 */
export const logger = new Logger();

/**
 * Create a namespaced logger for a specific module/component
 *
 * @example
 * ```tsx
 * const log = createLogger('AirportService');
 * log.info('Fetching airports', { limit: 100 });
 * // Output: [2024-01-01T12:00:00.000Z] [INFO] [AirportService] Fetching airports { limit: 100 }
 * ```
 */
export function createLogger(namespace: string): Logger {
  const namespacedLogger = new Logger();
  const originalOutput = namespacedLogger.output.bind(namespacedLogger);

  namespacedLogger.output = (
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ) => {
    originalOutput(level, `[${namespace}] ${message}`, context, error);
  };

  return namespacedLogger;
}
