import { Request, Response } from 'express';

jest.mock('@config/index', () => ({
  __esModule: true,
  default: { auth: { apiKey: 'test-api-key' } },
}));

import { ensureAuthenticated } from '@shared/infra/http/middlewares/authentication';

describe('ensureAuthenticated middleware', () => {
  let response: Response;
  let next: jest.Mock;

  beforeEach(() => {
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;
    next = jest.fn();
  });

  it('rejects requests without an API key', () => {
    const request = { headers: {} } as Request;

    ensureAuthenticated(request, response, next);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ message: 'Missing API key' });
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects requests with an invalid API key', () => {
    const request = { headers: { 'x-api-key': 'wrong-key' } } as unknown as Request;

    ensureAuthenticated(request, response, next);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ message: 'Invalid API key' });
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next when the API key is valid', () => {
    const request = { headers: { 'x-api-key': 'test-api-key' } } as unknown as Request;

    ensureAuthenticated(request, response, next);

    expect(next).toHaveBeenCalled();
    expect(response.status).not.toHaveBeenCalled();
  });
});
