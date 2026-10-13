import { plainToInstance } from 'class-transformer';
import { validate, type ValidationError } from 'class-validator';
import { HttpError } from './httpError.js';

const flattenErrors = (errors: ValidationError[]): string[] => {
  const messages: string[] = [];
  for (const e of errors) {
    if (e.constraints) messages.push(...Object.values(e.constraints));
    if (e.children?.length) messages.push(...flattenErrors(e.children));
  }
  return messages;
};


export async function Validator<T extends object>(
  dtoClass: new () => T,
  body: unknown
): Promise<T> {
  const dto = plainToInstance(dtoClass, body);
  const errors = await validate(dto);
  if (errors.length > 0) {
    throw new HttpError(400, 'Validation failed', flattenErrors(errors));
  }
  return dto;
}
