export interface UserPublic {
  id: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type TokenType = 'access' | 'refresh' | 'reset';

export interface AuthPayload {
  sub: string;
  role: string;
  type: TokenType;
  userAgent?: string;
  iat?: number;
  exp?: number;
}

export interface CreateUserInput {
  email: string;
  password: string;
  role: string;
}
