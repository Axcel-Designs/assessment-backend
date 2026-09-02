import { Router } from 'express';
import { CardController } from '../controllers/card.controller';
import { validateCardInputMiddleware } from '../middlewares/validate-dto.middleware';

const router = Router();

/**
 * POST /api/cards/validate
 * Body: { "cardNumber": "..." }
 */
router.post('/validate', validateCardInputMiddleware, CardController.validateCardHandler);

export default router;
