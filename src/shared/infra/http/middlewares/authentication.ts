import { NextFunction, Request, Response } from 'express';

import config from '@config/index';

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction): Response | void {
  const apiKey = request.headers['x-api-key'];

  if (!apiKey) {
    return response.status(401).json({ message: 'Missing API key' });
  }

  if (apiKey !== config.auth.apiKey) {
    return response.status(401).json({ message: 'Invalid API key' });
  }

  return next();
}
