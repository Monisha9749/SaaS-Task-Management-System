import { ValidationError, UniqueConstraintError } from 'sequelize';

/**
 * Centralized error handler — maps known errors to HTTP responses
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  if (err.name === 'SequelizeValidationError' || err instanceof ValidationError) {
    const messages = err.errors?.map((e) => e.message) || [err.message];
    return res.status(400).json({ message: 'Validation failed', errors: messages });
  }

  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({ message: 'Resource already exists' });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  return res.status(500).json({
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
}
