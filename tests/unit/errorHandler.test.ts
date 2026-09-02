import { Request, Response, NextFunction } from 'express';
import { AppError, errorHandler, notFound } from '../../src/middlewares/errorHandler.middleware';

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    nextFunction = jest.fn();
  });

  describe('AppError', () => {
    it('should create an AppError instance with custom status and code', () => {
      const error = new AppError('Card not found', 404, 'NOT_FOUND');
      expect(error.message).toBe('Card not found');
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
      expect(error.name).toBe('AppError');
    });

    it('should default to 500 status and INTERNAL_SERVER_ERROR code', () => {
      const error = new AppError('Unexpected failure');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('INTERNAL_SERVER_ERROR');
    });
  });

  describe('notFound', () => {
    it('should return 404 with standardized error payload', () => {
      notFound(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'The requested resource or endpoint was not found.'
        }
      });
    });
  });

  describe('errorHandler', () => {
    it('should handle custom AppError correctly', () => {
      const customError = new AppError('Unauthorized access', 401, 'UNAUTHORIZED');

      errorHandler(customError, mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Unauthorized access'
        }
      });
    });

    it('should handle generic 500 errors', () => {
      const genericError = new Error('Database crash');

      errorHandler(genericError, mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database crash'
        }
      });
    });

    it('should handle JSON body syntax errors gracefully', () => {
      const syntaxError = new SyntaxError('Unexpected token in JSON');
      (syntaxError as any).status = 400;
      (syntaxError as any).body = '{ invalid json }';

      errorHandler(syntaxError, mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INVALID_JSON',
          message: 'Malformed JSON payload in request body.'
        }
      });
    });
  });
});
