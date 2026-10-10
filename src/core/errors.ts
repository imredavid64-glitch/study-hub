export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly recoverable: boolean;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    statusCode = 500,
    recoverable = true,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.recoverable = recoverable;
    this.context = context;
  }

  static fromUnknown(error: unknown, context?: Record<string, unknown>): AppError {
    if (error instanceof AppError) return error;
    if (error instanceof Error) {
      return new AppError(error.message, 'UNKNOWN_ERROR', 500, true, { ...context, originalStack: error.stack });
    }
    return new AppError(String(error), 'UNKNOWN_ERROR', 500, true, context);
  }

  static networkError(message = 'Network request failed'): AppError {
    return new AppError(message, 'NETWORK_ERROR', 0, true);
  }

  static timeoutError(message = 'Request timed out'): AppError {
    return new AppError(message, 'TIMEOUT_ERROR', 408, true);
  }

  static authError(message = 'Authentication required'): AppError {
    return new AppError(message, 'AUTH_ERROR', 401, false);
  }

  static forbiddenError(message = 'Access denied'): AppError {
    return new AppError(message, 'FORBIDDEN_ERROR', 403, false);
  }

  static notFoundError(resource: string): AppError {
    return new AppError(`${resource} not found`, 'NOT_FOUND', 404, true);
  }

  static validationError(message: string, fields?: Record<string, string>): AppError {
    return new AppError(message, 'VALIDATION_ERROR', 400, true, { fields });
  }

  static rateLimitError(message = 'Too many requests', retryAfter?: number): AppError {
    return new AppError(message, 'RATE_LIMIT', 429, true, { retryAfter });
  }

  static aiError(message: string, provider?: string): AppError {
    return new AppError(message, 'AI_ERROR', 502, true, { provider });
  }

  static storageError(message: string, operation: 'read' | 'write' | 'delete'): AppError {
    return new AppError(message, 'STORAGE_ERROR', 500, false, { operation });
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      recoverable: this.recoverable,
      context: this.context,
    };
  }
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: AppError | null;
  errorId: string;
}

export function generateErrorId(): string {
  return `err_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function logError(error: AppError, context?: string): void {
  const errorId = generateErrorId();
  console.error(`[${errorId}]${context ? ` ${context}` : ''}`, error.toJSON());
}

export function isRecoverableError(error: unknown): boolean {
  if (error instanceof AppError) return error.recoverable;
  return true;
}

export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof AppError) {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Connection lost. Please check your internet and try again.';
      case 'TIMEOUT_ERROR':
        return 'Request timed out. Please try again.';
      case 'AUTH_ERROR':
        return 'Please sign in to continue.';
      case 'FORBIDDEN_ERROR':
        return 'You don\'t have permission to do that.';
      case 'NOT_FOUND':
        return 'The requested item was not found.';
      case 'VALIDATION_ERROR':
        return error.message;
      case 'RATE_LIMIT':
        return 'Too many requests. Please wait a moment and try again.';
      case 'AI_ERROR':
        return 'AI service is temporarily unavailable. Please try again later.';
      case 'STORAGE_ERROR':
        return 'Unable to save your data. Please try again.';
      default:
        return 'Something went wrong. Please try again.';
    }
  }
  return 'An unexpected error occurred. Please try again.';
}