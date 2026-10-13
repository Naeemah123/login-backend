import type { Request, Response, NextFunction } from 'express';

export class HttpError extends Error {
  status: number;
  errors: string[];

  constructor(status: number, message: string, errors: string[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.name = 'HttpError';
  }
}

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('[API ERROR]', error);
  const status = error instanceof HttpError ? error.status : 500;

  const message =
    error instanceof Error ? error.message : 'Internal server error';

  const errors = error instanceof HttpError ? error.errors : [];

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
