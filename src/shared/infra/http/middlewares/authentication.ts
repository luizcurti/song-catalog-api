import { NextFunction, Request, Response } from 'express';

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
    try {
      const { 'x-api-key': xApiKey } = request.headers;

      if (!xApiKey) { response.status(401).json({ 'Bad Request 2': 'Something went wrong!' }); }
      if (xApiKey !== process.env.x_api_key) { response.status(401).json({ 'Bad Request 34': 'Something went wrong!' }); }

      next();
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
  