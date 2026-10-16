import { describe, expect, it } from 'vitest';
import { validator } from './validator.service.js';
import { AuthRegisterBodyDto } from '../../modules/auth/auth.dto.js';
import { Exception } from '../error/error.service.js';

describe('validator', () => {
  it('accepts valid register payload', async () => {
    const dto = await validator(AuthRegisterBodyDto, {
      email: 'user@example.com',
      password: 'secret123',
    });
    expect(dto.email).toBe('user@example.com');
  });

  it('rejects invalid payload with field errors', async () => {
    await expect(
      validator(AuthRegisterBodyDto, { email: 'bad', password: '123' }),
    ).rejects.toMatchObject({ status: 400 });
    try {
      await validator(AuthRegisterBodyDto, { email: 'bad', password: '123' });
    } catch (err) {
      expect(err).toBeInstanceOf(Exception);
      expect((err as Exception).errors.email).toBeDefined();
    }
  });
});
