import { Request, Response } from 'express';

const fakeDataSource = { isInitialized: true };

jest.mock('@shared/infra/database/dataSource', () => ({ AppDataSource: fakeDataSource }));
jest.mock('@shared/infra/redis', () => ({
  __esModule: true,
  default: { isHealthy: jest.fn() },
}));

import { healthCheck } from '@shared/infra/http/routes/healthRoute';
import cache from '@shared/infra/redis';

describe('healthCheck', () => {
  let response: Response;

  beforeEach(() => {
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
    fakeDataSource.isInitialized = true;
  });

  it('returns 200 when the database and redis are both up', async () => {
    fakeDataSource.isInitialized = true;
    (cache.isHealthy as jest.Mock).mockResolvedValueOnce(true);

    await healthCheck({} as Request, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ status: 'ok', database: 'up', redis: 'up' });
  });

  it('returns 503 when the database is down', async () => {
    fakeDataSource.isInitialized = false;
    (cache.isHealthy as jest.Mock).mockResolvedValueOnce(true);

    await healthCheck({} as Request, response);

    expect(response.status).toHaveBeenCalledWith(503);
    expect(response.json).toHaveBeenCalledWith({ status: 'degraded', database: 'down', redis: 'up' });
  });

  it('returns 503 when redis is down', async () => {
    fakeDataSource.isInitialized = true;
    (cache.isHealthy as jest.Mock).mockResolvedValueOnce(false);

    await healthCheck({} as Request, response);

    expect(response.status).toHaveBeenCalledWith(503);
    expect(response.json).toHaveBeenCalledWith({ status: 'degraded', database: 'up', redis: 'down' });
  });
});
