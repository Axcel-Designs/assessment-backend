import { Request, Response, NextFunction } from 'express';

export function errorHandlerMiddleware(
  err: Error & { status?: number; type?: string },
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Handle Express JSON syntax parsing error (e.g. malformed JSON body)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(400).json({
      success: false,
      error: {
        code: 'MALFORMED_JSON',
        message: 'Invalid JSON syntax in request body.'
      }
    });
    return;
  }

  // General internal server error fallback
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      code: statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'HTTP_ERROR',
      message: err.message || 'An unexpected error occurred.'
    }
  });
}
