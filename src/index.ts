import express, { type Express, type Request, type Response } from 'express';
import { specs, swaggerUi } from './config/swagger.js';
import cors from 'cors';
import mongoose from 'mongoose';
import { errorHandler } from './utils/httpError.js';
import { config } from './config/index.js';
import authRoutes from './modules/auth/auth.routes.js';

const app: Express = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors({
  origin: config.corsOrigins
}));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/auth', authRoutes);
app.use(errorHandler);

const port = config.port;

mongoose.connect(config.database.url)
  .then(() => {
    console.log(`MongoDB connected [env=${config.env}]`);

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
  });
