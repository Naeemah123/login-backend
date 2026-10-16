import type { Request, Response, NextFunction } from 'express';

import { authService } from './auth.service.js';
import { send } from '../../core/app.util.js';
import type { AuthRequest } from '../../core/middleware/index.middleware.js';
import { ValidateBody } from '../../core/validator/validate.decorator.js';
import {
  AuthLoginBodyDto,
  AuthRegisterBodyDto,
  AuthRefreshTokenBodyDto,
} from './auth.dto.js';

export class AuthController {
  @ValidateBody(AuthLoginBodyDto)
  async login(req: Request, res: Response, _next: NextFunction) {
    const dto = req.body as AuthLoginBodyDto;
    const userAgent = req.headers['user-agent'] ?? '';

    const { accessToken, refreshToken } = await authService.login(
      dto.email,
      dto.password,
      userAgent,
    );

    return send(req, res, {
      message: 'Login successful',
      data: { accessToken, refreshToken },
    });
  }

  @ValidateBody(AuthRegisterBodyDto)
  async register(req: Request, res: Response, _next: NextFunction) {
    const dto = req.body as AuthRegisterBodyDto;
    const user = await authService.register(dto.email, dto.password);

    return send(req, res, {
      message: 'Registration successful',
      data: { user },
    });
  }

  @ValidateBody(AuthRefreshTokenBodyDto)
  async refresh(req: Request, res: Response, _next: NextFunction) {
    const userAgent = req.headers['user-agent'] ?? '';
    const dto = req.body as AuthRefreshTokenBodyDto;
    const { accessToken } = await authService.refreshAccessToken(
      dto.refreshToken,
      userAgent,
    );

    return send(req, res, {
      message: 'Access token refreshed successfully',
      data: { accessToken },
    });
  }

  async dashboard(req: AuthRequest, res: Response) {
    return send(req, res, {
      message: 'Dashboard retrieved successfully',
      data: req.tokenHolder,
    });
  }
}

export const authController = new AuthController();
