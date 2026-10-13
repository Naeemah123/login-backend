import type { Response } from 'express';

interface SendOptions {
  message: string;
  data?: unknown;
  code?: number;
}

export function send(res: Response, { message, data = {}, code = 200 }: SendOptions) {
  return res.status(code).json({
    response: {
      status: 'SUCCESS',
      message,
      code,
      errors: [],
    },
    data,
  });
}
