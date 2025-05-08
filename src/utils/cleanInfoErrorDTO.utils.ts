import { ZodError } from 'zod';

export const simplifyErrors = (error: ZodError) => {
  return error.errors.map((e) => ({
    field: e.path.join('.'),
    message: e.message,
  }));
};
