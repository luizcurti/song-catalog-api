import { Request, Response, Router } from 'express';

import { AppDataSource } from '@shared/infra/database/dataSource';
import cache from '@shared/infra/redis';

export async function healthCheck(_request: Request, response: Response): Promise<Response> {
  const database = AppDataSource.isInitialized;
  const redis = await cache.isHealthy();
  const healthy = database && redis;

  return response.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    database: database ? 'up' : 'down',
    redis: redis ? 'up' : 'down',
  });
}

const healthRoute = Router();
healthRoute.get('/', healthCheck);

export { healthRoute };
