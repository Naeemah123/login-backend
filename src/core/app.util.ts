import type { Request, Response } from 'express';

interface SendOptions {
  message: string;
  data?: unknown;
  statusCode?: number;
}

export function send(
  req: Request,
  res: Response,
  { message, data = {}, statusCode: overrideStatus }: SendOptions,
) {
  const cleanData = sanitizeData(data);
  let statusCode: number;

  if (overrideStatus !== undefined) {
    statusCode = overrideStatus;
  } else if (cleanData === null || cleanData === undefined) {
    statusCode = 204;
  } else if (req.method === 'POST') {
    statusCode = 201;
  } else if (req.method === 'GET') {
    statusCode = 200;
  } else if (req.method === 'PUT' || req.method === 'DELETE') {
    statusCode = 202;
  } else {
    statusCode = 200;
  }
  if (statusCode === 204) {
    return res.status(statusCode).end();
  }
  return res.status(statusCode).json({
    response: {
      status: 'SUCCESS',
      message,
      code: statusCode,
      errors: [],
    },
    data: cleanData,
  });
}

const SENSITIVE_KEYS = new Set(['password', '__v']);

function toPlain(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    'toObject' in value &&
    typeof (value as { toObject: unknown }).toObject === 'function'
  ) {
    return (value as { toObject: () => unknown }).toObject();
  }

  return value;
}

function sanitizeData(value: unknown): unknown {
  const plain = toPlain(value);

  if (Array.isArray(plain)) {
    return plain.map((item) => sanitizeData(item));
  }

  if (typeof plain === 'object' && plain !== null) {
    const record = plain as Record<string, unknown>;
    const clean: Record<string, unknown> = {};

    for (const [key, val] of Object.entries(record)) {
      if (SENSITIVE_KEYS.has(key)) {
        continue;
      }

      if (key === '_id') {
        if (!('id' in record)) {
          clean['id'] = String(val);
        }
        continue;
      }

      clean[key] = sanitizeData(val);
    }

    return clean;
  }

  return plain;
}
