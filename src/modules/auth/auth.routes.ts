import rateLimit from 'express-rate-limit';
import { authController } from './auth.controller.js';
import auth from '../../core/middleware/index.middleware.js';
import { AppRouter } from '../../core/router/app-router.js';

const appRouter = new AppRouter();

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    response: {
      status: 'FAILED',
      message: 'Too many requests, please try again later',
      code: 429,
      errors: [],
    },
    data: {},
  },
});

appRouter.post('/register', authLimiter, authController.register);
appRouter.post('/login', authLimiter, authController.login);
appRouter.post('/refresh', authLimiter, authController.refresh);
appRouter.get('/dashboard', auth, authController.dashboard);

export default appRouter.router;
