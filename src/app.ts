import express, { Application, Request, Response } from 'express';
import cardRoutes from './routes/card.routes';
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware';

const app: Application = express();

// Parse incoming JSON requests
app.use(express.json());

// Health check / API root route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Card Number Validation API is operational.',
    documentation: '/api/v1/cards/validate'
  });
});

// Card validation routes
app.use('/api/v1/cards', cardRoutes);
// Alias for convenience / flexible client integration
app.use('/api', cardRoutes);

// Catch-all 404 handler for undefined endpoints
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'The requested resource or endpoint was not found.'
    }
  });
});

// Centralized error handling middleware
app.use(errorHandlerMiddleware);

export default app;
