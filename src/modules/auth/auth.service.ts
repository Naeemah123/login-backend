import jwt from 'jsonwebtoken';
import { authRepository } from './auth.repository.js';
import { hashPassword, comparePassword } from '../../core/password.js';
import { Exception } from '../../core/error/error.service.js';
import { config } from '../../config/index.js';
import type { UserPublic } from './auth.interface.js';

const toPublicUser = (user: {
  id: string;
  email: string;
  role: string;
}): UserPublic => ({
  id: user.id,
  email: user.email,
  role: user.role,
});

export class AuthService {
  async register(email: string, password: string): Promise<UserPublic> {
    const existingUser = await authRepository.findByEmail(email);

    if (existingUser) {
      throw new Exception(409, 'Similar record already exist');
    }

    const hashedPassword = await hashPassword(password);

    const user = await authRepository.createUser({
      email,
      password: hashedPassword,
      role: 'user',
    });

    return toPublicUser({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }

  async login(email: string, password: string, userAgent: string) {
    const user = await authRepository.findByEmailForLogin(email);

    if (!user) {
      throw new Exception(401, 'Invalid email or password');
    }
    if (user.isSuspend) {
      throw new Exception(
        403,
        'Your account has been suspended. Please contact support.',
      );
    }

    if (user.isDelete) {
      throw new Exception(403, 'Your account is no longer active.');
    }
    if (typeof password !== 'string' || typeof user.password !== 'string') {
      throw new Exception(401, 'Invalid email or password');
    }
    const passwordCheck = await comparePassword(password, user.password);

    if (!passwordCheck) {
      throw new Exception(401, 'Invalid email or password');
    }

    const accessToken = jwt.sign(
      {
        sub: user.email,
        role: user.role,
        type: 'access',
        userAgent,
      },
      config.jwt.accessSecret,
      { expiresIn: config.jwt.accessExpiresIn },
    );

    const refreshToken = jwt.sign(
      {
        sub: user.email,
        role: user.role,
        type: 'refresh',
        userAgent,
      },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn },
    );

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string, userAgent: string) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);

      if (
        typeof decoded === 'string' ||
        decoded.type !== 'refresh' ||
        typeof decoded.sub !== 'string'
      ) {
        throw new Exception(401, 'Invalid refresh token');
      }
      if (
        typeof decoded.userAgent !== 'string' ||
        decoded.userAgent !== userAgent
      ) {
        throw new Exception(401, 'Device mismatch');
      }

      const user = await authRepository.findByEmailWithStatus(decoded.sub);

      if (!user || user.isDelete || user.isSuspend) {
        throw new Exception(401, 'User account is unavailable');
      }

      const accessToken = jwt.sign(
        {
          sub: user.email,
          role: user.role,
          type: 'access',
          userAgent: decoded.userAgent,
        },
        config.jwt.accessSecret,
        { expiresIn: config.jwt.accessExpiresIn },
      );

      return { accessToken };
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }

      throw new Exception(401, 'Invalid or expired refresh token');
    }
  }
}

export const authService = new AuthService();
