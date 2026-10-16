import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';

import { config } from './config/index.js';
import { errorHandler } from './core/error/error.service.js';
import { startServer } from './core/startup.js';
import { specs, swaggerUi } from './core/swagger.js';
import { swaggerAuthMiddleware } from './core/middleware/index.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';

const app: Express = express();

app.use(cors({ origin: config.corsOrigins }));
app.use(express.json());

app.use(
  '/api-docs',
  swaggerAuthMiddleware,
  swaggerUi.serve,
  swaggerUi.setup(specs),
);

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/auth', authRoutes);

app.use(errorHandler);

startServer(app);
