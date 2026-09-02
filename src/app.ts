import express, { Application, Request, Response } from 'express';
import cardRoutes from './routes/card.routes';
import { errorHandler, notFound } from './middlewares/errorHandler.middleware';

const app: Application = express();

app.use(express.json());

// Health check / API root route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Card Number Validation API is operational.',
    documentation: '/api/cards/validate'
  });
});

// Card validation routes
app.use('/api/cards', cardRoutes);
// Alias for convenience / flexible client integration
app.use('/api', cardRoutes);


app.use(notFound);
app.use(errorHandler);

export default app;
