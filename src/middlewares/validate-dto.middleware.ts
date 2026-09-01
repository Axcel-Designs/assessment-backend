import { Request, Response, NextFunction } from 'express';

export function validateCardInputMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Check if body exists
  if (!req.body || typeof req.body !== 'object') {
    res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Request body must be a JSON object.'
      }
    });
    return;
  }

  const rawCardNumber = req.body.cardNumber ?? req.body.card_number;

  // Check if cardNumber field is present
  if (rawCardNumber === undefined || rawCardNumber === null) {
    res.status(400).json({
      success: false,
      error: {
        code: 'MISSING_CARD_NUMBER',
        message: 'Card number is required. Please provide a "cardNumber" field in the request body.'
      }
    });
    return;
  }

  // Ensure field is a string (or convertible string) and not empty
  if (typeof rawCardNumber !== 'string') {
    res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_TYPE',
        message: 'Card number must be provided as a string.'
      }
    });
    return;
  }

  if (rawCardNumber.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: {
        code: 'EMPTY_CARD_NUMBER',
        message: 'Card number cannot be empty.'
      }
    });
    return;
  }

  // Attach normalized cardNumber to res.locals for downstream processing if needed
  res.locals.rawCardNumber = rawCardNumber;
  next();
}
