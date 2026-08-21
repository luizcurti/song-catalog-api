import { NextFunction, Request, Response } from 'express';

import { AppError } from '@errors/appError';

const mockLogger = { info: jest.fn(), error: jest.fn() };
jest.mock('@shared/infra/logger', () => ({ logger: mockLogger }));

import { handlingErrors } from '@shared/infra/http/middlewares/handlingErrors';

describe('handlingErrors middleware', () => {
  let response: Response;
  let next: NextFunction;

  beforeEach(() => {
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;
    next = jest.fn();
  });

  it('responds with the AppError status code, message and type', () => {
    const error = new AppError('Song does not exist', 404, 'Not Found');

    handlingErrors(error, {} as Request, response, next);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({ message: 'Song does not exist', type: 'Not Found' });
    expect(next).not.toHaveBeenCalled();
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('logs and hides internal error details in production', () => {
    process.env.NODE_ENV = 'production';
    const error = new Error('unexpected failure');

    handlingErrors(error, {} as Request, response, next);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    expect(mockLogger.error).toHaveBeenCalledWith({ err: error }, 'unhandled error');

    process.env.NODE_ENV = 'test';
  });

  it('exposes internal error details outside production', () => {
    process.env.NODE_ENV = 'test';
    const error = new Error('unexpected failure');

    handlingErrors(error, {} as Request, response, next);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Internal server error', detail: 'unexpected failure' }),
    );
  });

  it('calls next when there is no error', () => {
    handlingErrors(undefined as unknown as Error, {} as Request, response, next);

    expect(next).toHaveBeenCalled();
    expect(response.status).not.toHaveBeenCalled();
  });
});
