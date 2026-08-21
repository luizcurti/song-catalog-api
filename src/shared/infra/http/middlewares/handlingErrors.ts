import { NextFunction, Request, Response } from 'express';

import { AppError } from '@errors/appError';
import { logger } from '@shared/infra/logger';

export function handlingErrors(err: Error, _request: Request, response: Response, next: NextFunction): Response | void {
  if (!err) {
    return next();
  }

  if (err instanceof AppError) {
    return response.status(err.code).json({
      message: err.message,
      type: err.type,
    });
  }

  logger.error({ err }, 'unhandled error');

  const isDev = process.env.NODE_ENV !== 'production';
  const data = {
    message: 'Internal server error',
    ...(isDev && { detail: err.message, errorStack: err.stack }),
  };

  return response.status(500).json(data);
}
