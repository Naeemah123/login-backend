import { Router } from 'express';
import * as controller from './auth.controller.js';
import auth from '../../index.middleware.js';
const router = Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/refresh', controller.refresh);
router.get('/dashboard', auth, controller.dashboard);

export default router;
