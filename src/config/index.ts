import path from 'node:path';
import dotenv from 'dotenv';
import type { SignOptions } from 'jsonwebtoken';

const nodeEnv = process.env.NODE_ENV || 'local';

const envFile =
  nodeEnv === 'prod' ? 'prod.env' : nodeEnv === 'dev' ? 'dev.env' : 'local.env';

// 1) Environment-specific file chosen by NODE_ENV.
dotenv.config({ path: path.resolve(process.cwd(), 'environments', envFile) });
// 2) Root .env as fallback (does not override values already set).
dotenv.config();

const required = (value: string | undefined, name: string): string => {
  if (!value) {
    console.error(`[config] Missing required env value: ${name} (NODE_ENV=${nodeEnv}, file=environments/${envFile})`);
    process.exit(1);
  }
  return value;
};

// Backwards compatible: prefer separate secrets, fall back to legacy JWT_SECRET_KEY.
const accessSecret =
  process.env.JWT_ACCESS_SECRET_KEY || process.env.JWT_SECRET_KEY;
const refreshSecret =
  process.env.JWT_REFRESH_SECRET_KEY || process.env.JWT_SECRET_KEY;

const accessExpiresIn = (
  process.env.JWT_ACCESS_EXPIRES_IN || '15m'
) as NonNullable<SignOptions['expiresIn']>;

const refreshExpiresIn = (
  process.env.JWT_REFRESH_EXPIRES_IN || '7d'
) as NonNullable<SignOptions['expiresIn']>;

export const config = {
  env: nodeEnv,
  database: {
    url: required(process.env.MONGODB_URI, 'MONGODB_URI'),
  },
  jwt: {
    accessSecret: required(accessSecret, 'JWT_ACCESS_SECRET_KEY (or JWT_SECRET_KEY)'),
    refreshSecret: required(refreshSecret, 'JWT_REFRESH_SECRET_KEY (or JWT_SECRET_KEY)'),
    accessExpiresIn,
    refreshExpiresIn,
  },
  port: Number(process.env.PORT) || 3000,
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:4200')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
};
