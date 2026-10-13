import type { Request, Response } from 'express';

import * as authService from './auth.service.js';
import { asyncHandler } from '../../utils/httpError.js';
import { Validator } from '../../utils/validate.js';
import { send } from '../../utils/send.js';
import type { AuthRequest } from '../../index.middleware.js';
import { LoginDto, RegisterDto, RefreshTokenDto } from './auth.dto.js';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const dto = await Validator(LoginDto, req.body);
  const { accessToken, refreshToken } = await authService.login(dto.email, dto.password);
  return send(res, {
    message: 'Login successful',
    data: { accessToken, refreshToken },
    code: 200,
  });
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const dto = await Validator(RegisterDto, req.body);
  const user = await authService.register(dto.email, dto.password);
  return send(res, {
    message: 'Registration successful',
    data: { user },
    code: 201,
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const dto = await Validator(RefreshTokenDto, req.body);
  const { accessToken } = await authService.refreshAccessToken(dto.refreshToken);
  return send(res, {
    message: 'Access token refreshed successfully',
    data: { accessToken },
    code: 200,
  });
});

export const dashboard = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    return send(res, {
      message: 'Dashboard retrieved successfully',
      data: req.tokenHolder,
      code: 200,
    });
  }
);
