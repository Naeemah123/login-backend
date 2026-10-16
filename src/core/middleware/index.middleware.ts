import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config/index.js';
import { Exception } from '../error/error.service.js';
import { authRepository } from '../../modules/auth/auth.repository.js';

export interface AuthRequest extends Request {
  tokenHolder?: {
    id: string;
    email: string;
    role: string;
  };
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new Exception(401, 'Authorization header missing'));
    }

    const [scheme, token, ...extra] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token || extra.length > 0) {
      return next(new Exception(401, 'Invalid authorization header'));
    }

    const decoded = jwt.verify(token, config.jwt.accessSecret);

    if (typeof decoded === 'string' || decoded.type !== 'access') {
      return next(new Exception(401, 'Invalid access token'));
    }
    const userAgent = req.headers['user-agent'] ?? '';

    if (decoded.userAgent !== userAgent) {
      return next(new Exception(401, 'Device mismatch'));
    }
    if (typeof decoded.sub !== 'string') {
      return next(new Exception(401, 'Invalid token payload'));
    }

    const user = await authRepository.findByEmailWithStatus(decoded.sub);

    if (!user || user.isDelete || user.isSuspend) {
      return next(new Exception(401, 'User account is unavailable'));
    }

    req.tokenHolder = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    return next();
  } catch (error) {
    if (error instanceof Exception) {
      return next(error);
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return next(new Exception(401, 'Invalid or expired token'));
    }

    return next(error);
  }
};

export default authMiddleware;

export const swaggerAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="API Documentation"');
    return res.status(401).send('Authentication required');
  }

  const credentials = Buffer.from(authHeader.slice(6), 'base64').toString(
    'utf8',
  );

  const separatorIndex = credentials.indexOf(':');

  if (separatorIndex === -1) {
    res.setHeader('WWW-Authenticate', 'Basic realm="API Documentation"');
    return res.status(401).send('Invalid credentials');
  }

  const username = credentials.slice(0, separatorIndex);
  const password = credentials.slice(separatorIndex + 1);

  if (
    username !== config.swaggerUsername ||
    password !== config.swaggerPassword
  ) {
    res.setHeader('WWW-Authenticate', 'Basic realm="API Documentation"');
    return res.status(401).send('Invalid credentials');
  }

  return next();
};
