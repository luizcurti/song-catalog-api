import { Request, Response } from 'express';

import { handlingNotFound } from '@shared/infra/http/middlewares/handlingNotFound';

describe('handlingNotFound middleware', () => {
  it('responds with 404 and a not-found message', () => {
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    handlingNotFound({} as Request, response, jest.fn());

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({ message: 'Route Not Found' });
  });
});
