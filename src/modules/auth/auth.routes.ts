import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as controller from './auth.controller.js';
import auth from '../../index.middleware.js';

const router = Router();

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

router.post('/register', authLimiter, controller.register);
router.post('/login', authLimiter, controller.login);
router.post('/refresh', controller.refresh);
router.get('/dashboard', auth, controller.dashboard);

export default router;
