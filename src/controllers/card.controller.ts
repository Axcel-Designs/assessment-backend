import { Request, Response } from 'express';
import { CardService } from '../services/card.service';

export class CardController {
  /**
   * Endpoint handler for POST /api/cards/validate
   */
  public static validateCardHandler(req: Request, res: Response): void {
    const rawCardNumber: string = res.locals.rawCardNumber ?? req.body.cardNumber ?? req.body.card_number;

    const result = CardService.validateCard(rawCardNumber);

    res.status(200).json({
      success: true,
      data: result
    });
  }
}
