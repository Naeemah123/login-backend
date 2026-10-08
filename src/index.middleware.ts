import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { config } from './config/index.js';
import { HttpError } from './utils/httpError.js';

export interface AuthRequest extends Request {
  tokenHolder?: string | jwt.JwtPayload;
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new HttpError(401, 'Authorization header missing'));
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return next(new HttpError(401, 'Token missing'));
    }

    const decoded = jwt.verify(
      token,
      config.jwt.secret
    );

    req.tokenHolder = decoded;

    next();
  } catch (error) {
    next(new HttpError(401, 'Invalid or expired token'));
  }
};

export default authMiddleware;