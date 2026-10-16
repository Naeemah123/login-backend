import type { Request, Response, NextFunction } from 'express';

export class Exception extends Error {
  status: number;
  errors: Record<string, string[]>;

  constructor(
    status: number,
    message: string,
    errors: Record<string, string[]> = {},
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.name = 'Exception';
  }
}

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error('[API ERROR]', error);

  const status = error instanceof Exception ? error.status : 500;
  const message =
    error instanceof Exception ? error.message : 'Internal server error';
  const errors = error instanceof Exception ? error.errors : {};

  res.status(status).json({
    response: {
      status: 'FAILED',
      message,
      code: status,
      errors,
    },
    data: {},
  });
};
