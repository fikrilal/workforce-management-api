export class AppError extends Error {
  status: number;
  code?: string;
  meta?: Record<string, unknown>;
  constructor(message: string, status = 400, code?: string, meta?: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.code = code;
    this.meta = meta;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', meta?: Record<string, unknown>) {
    super(message, 401, 'UNAUTHORIZED', meta);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', meta?: Record<string, unknown>) {
    super(message, 403, 'FORBIDDEN', meta);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not Found', meta?: Record<string, unknown>) {
    super(message, 404, 'NOT_FOUND', meta);
  }
}

