import jwt from 'jsonwebtoken';
import { findByEmail, createUser } from './auth.repository.js';
import { hashPassword, comparePassword } from '../../utils/passwordHash.js';
import { HttpError } from '../../utils/httpError.js';
import { config } from '../../config/index.js';

export const register = async (email: string, password: string) => {
  const existingUser = await findByEmail(email);

  if (existingUser) {
    throw new HttpError(409, 'User already exists');
  }

  const hashedPassword = await hashPassword(password);

  const user = await createUser({
    email,
    password: hashedPassword,
    role: 'user',
  });

  return user;

};

export const login = async (email: string, password: string) => {
  const user = await findByEmail(email);

  if (!user) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const passwordCheck = await comparePassword(password, user.password);

  if (!passwordCheck) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const accessToken = jwt.sign(
    { sub: email, role: user.role, type: 'access' },
    config.jwt.secret,
    { expiresIn: config.jwt.accessExpiresIn }
  );

  const refreshToken = jwt.sign(
    { sub: email, role: user.role, type: 'refresh' },
    config.jwt.secret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );

  return { accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, config.jwt.secret);

    if (typeof decoded === 'string' || decoded.type !== 'refresh') {
      throw new HttpError(401, 'Invalid refresh token');
    }

    const accessToken = jwt.sign(
      { sub: decoded.sub, role: decoded.role, type: 'access' },
      config.jwt.secret,
      { expiresIn: config.jwt.accessExpiresIn }
    );

    return { accessToken };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    throw new HttpError(401, 'Invalid or expired refresh token');
  }
};