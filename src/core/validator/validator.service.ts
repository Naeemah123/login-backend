import { plainToInstance } from 'class-transformer';
import { validate, type ValidationError } from 'class-validator';
import { Exception } from '../error/error.service.js';

const flattenErrors = (
  errors: ValidationError[],
  parentPath = '',
): Record<string, string[]> => {
  const messages: Record<string, string[]> = {};

  for (const error of errors) {
    const propertyPath = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    if (error.constraints) {
      messages[propertyPath] = Object.values(error.constraints);
    }

    if (error.children?.length) {
      Object.assign(messages, flattenErrors(error.children, propertyPath));
    }
  }

  return messages;
};

export async function validator<T extends object>(
  dtoClass: new () => T,
  body: unknown,
): Promise<T> {
  const dto = plainToInstance(dtoClass, body);
  const errors = await validate(dto);
  if (errors.length > 0) {
    throw new Exception(400, 'Validation failed', flattenErrors(errors));
  }
  return dto;
}
