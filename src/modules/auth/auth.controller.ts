import type { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import * as authService from './auth.service.js';
import { asyncHandler, HttpError } from '../../utils/httpError.js';
import type { AuthRequest } from '../../index.middleware.js';
import { LoginDto, RegisterDto, RefreshTokenDto } from './auth.dto.js';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const dto = plainToInstance(LoginDto, req.body);

  const errors = await validate(dto);

  if (errors.length > 0) {
    throw new HttpError(400, 'Validation exception');
  }

  const { accessToken, refreshToken } = await authService.login(
    dto.email,
    dto.password
  );

  res.status(200).json({
    response: {
      status: 'SUCCESS',
      message: 'Login successful',
      code: 200,
      errors: [],
    },
    data: { accessToken, refreshToken },
  });
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const dto = plainToInstance(RegisterDto, req.body);

  const errors = await validate(dto);

  if (errors.length > 0) {
    throw new HttpError(400, 'Validation exception');
  }

  const user = await authService.register(dto.email, dto.password);

  res.status(201).json({
    response: {
      status: 'SUCCESS',
      message: 'Registration successful',
      code: 201,
      errors: [],
    },
    data: {
      user,
    },
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const dto = plainToInstance(RefreshTokenDto, req.body);

  const errors = await validate(dto);

  if (errors.length > 0) {
    throw new HttpError(400, 'Validation exception');
  }

  const { accessToken } = await authService.refreshAccessToken(
    dto.refreshToken
  );

  res.status(200).json({
    response: {
      status: 'SUCCESS',
      message: 'Access token refreshed successfully',
      code: 200,
      errors: [],
    },
    data: { accessToken },
  });
});

export const dashboard = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    res.status(200).json({
      response: {
        status: 'SUCCESS',
        message: 'Dashboard retrieved successfully',
        code: 200,
        errors: [],
      },
      data: req.tokenHolder,
    });
  }
);
