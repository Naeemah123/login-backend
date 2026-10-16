import { describe, expect, it, vi } from 'vitest';
import { send } from './app.util.js';

const mockRes = () => {
  const json = vi.fn();
  const status = vi.fn(() => ({ json, end: vi.fn() }));
  return { status, json };
};

describe('send', () => {
  it('returns 201 for POST', () => {
    const res = mockRes() as any;
    send({ method: 'POST' } as any, res, { message: 'ok', data: { id: 1 } });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('returns 200 for GET', () => {
    const res = mockRes() as any;
    send({ method: 'GET' } as any, res, { message: 'ok', data: { id: 1 } });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('returns 202 for PUT and DELETE', () => {
    for (const method of ['PUT', 'DELETE']) {
      const res = mockRes() as any;
      send({ method } as any, res, { message: 'ok', data: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(202);
    }
  });

  it('returns 204 when no record found', () => {
    const end = vi.fn();
    const res = { status: vi.fn(() => ({ json: vi.fn(), end })) } as any;
    send({ method: 'GET' } as any, res, { message: 'ok', data: null });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(end).toHaveBeenCalled();
  });
});
