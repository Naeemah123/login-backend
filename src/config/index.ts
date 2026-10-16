import path from 'node:path';
import dotenv from 'dotenv';
import type { SignOptions } from 'jsonwebtoken';
import { Exception } from '../core/error/error.service.js';

const allowedEnvironments = [
  'local',
  'development',
  'sandbox',
  'production',
] as const;

type Environment = (typeof allowedEnvironments)[number];

const rawEnv = process.env.NODE_ENV || 'local';

if (!allowedEnvironments.includes(rawEnv as Environment)) {
  throw new Exception(500, `Invalid NODE_ENV: ${rawEnv}`);
}

const nodeEnv = rawEnv as Environment;
const envFile = `${nodeEnv}.env`;

dotenv.config({
  path: path.resolve(process.cwd(), 'environments', envFile),
});

dotenv.config();

const required = (value: string | undefined, name: string): string => {
  if (!value) {
    console.error(
      `[config] Missing required env value: ${name} (NODE_ENV=${nodeEnv}, file=environments/${envFile})`,
    );
    process.exit(1);
  }

  return value;
};

const accessSecret =
  process.env.JWT_ACCESS_SECRET_KEY || process.env.JWT_SECRET_KEY;

const refreshSecret =
  process.env.JWT_REFRESH_SECRET_KEY || process.env.JWT_SECRET_KEY;

const accessExpiresIn = (process.env.JWT_ACCESS_EXPIRES_IN ||
  '15m') as NonNullable<SignOptions['expiresIn']>;

const refreshExpiresIn = (process.env.JWT_REFRESH_EXPIRES_IN ||
  '7d') as NonNullable<SignOptions['expiresIn']>;

export const config = {
  env: nodeEnv,

  database: {
    url: required(process.env.MONGODB_URI, 'MONGODB_URI'),
  },

  jwt: {
    accessSecret: required(
      accessSecret,
      'JWT_ACCESS_SECRET_KEY (or JWT_SECRET_KEY)',
    ),
    refreshSecret: required(
      refreshSecret,
      'JWT_REFRESH_SECRET_KEY (or JWT_SECRET_KEY)',
    ),
    accessExpiresIn,
    refreshExpiresIn,
  },

  port: Number(process.env.PORT) || 3000,

  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:4200')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),

  swaggerUsername: required(process.env.SWAGGER_USERNAME, 'SWAGGER_USERNAME'),

  swaggerPassword: required(process.env.SWAGGER_PASSWORD, 'SWAGGER_PASSWORD'),
};
