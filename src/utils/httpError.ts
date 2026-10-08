import type { Request, Response, NextFunction } from 'express';
/** Operational HTTP error with status code. */
export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'HttpError';
  }
}

/** Wrap async route handlers — no try/catch boilerplate in controllers. */
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
  const status = error instanceof HttpError ? error.status : 500;

  const message =
    error instanceof Error ? error.message : 'Internal server error';

  res.status(status).json({
    response: {
      status: 'FAILED',
      message,
      code: status,
      errors: [],
    },
    data: {},
  });
};