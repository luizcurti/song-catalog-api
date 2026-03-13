import { NextFunction, Request, Response } from 'express';

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { 'x-api-key': xApiKey } = request.headers;

  if (!xApiKey) {
    return response.status(401).json({ message: 'Missing API key' });
  }

  if (xApiKey !== process.env.x_api_key) {
    return response.status(401).json({ message: 'Invalid API key' });
  }

  return next();
}
  