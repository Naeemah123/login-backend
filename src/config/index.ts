import type { SignOptions } from 'jsonwebtoken';
import 'dotenv/config';

const accessExpiresIn = (
  process.env.JWT_ACCESS_EXPIRES_IN || '15m'
) as NonNullable<SignOptions['expiresIn']>;

const refreshExpiresIn = (
  process.env.JWT_REFRESH_EXPIRES_IN || '7d'
) as NonNullable<SignOptions['expiresIn']>;

export const config = {
  database: {
    url: process.env.MONGODB_URI!,
  },
  jwt: {
    secret: process.env.JWT_SECRET_KEY!,
    accessExpiresIn,
    refreshExpiresIn,
  },
  port: Number(process.env.PORT) || 3000,
};