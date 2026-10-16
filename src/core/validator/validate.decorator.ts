import type { Request, Response, NextFunction } from 'express';
import { validator } from './validator.service.js';
import { Exception } from '../error/error.service.js';

type DtoClass<T extends object> = new () => T;

export function ValidateBody<T extends object>(dtoClass: DtoClass<T>) {
  return function (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): void {
    const originalMethod = descriptor.value as (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => unknown;

    if (typeof originalMethod !== 'function') {
      throw new Exception(500, 'ValidateBody can only decorate a method');
    }

    descriptor.value = async function (
      this: unknown,
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<unknown> {
      try {
        req.body = await validator(dtoClass, req.body);
        return await originalMethod.call(this, req, res, next);
      } catch (error) {
        next(error);
      }
    };
  };
}
