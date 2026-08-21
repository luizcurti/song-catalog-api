import request from 'supertest';

import { App } from '@shared/infra/app';

describe('GET /health (e2e)', () => {
  const app = new App();

  beforeAll(async () => {
    await app.init();
  });

  afterAll(async () => {
    await app.shutdown();
  });

  it('reports the API as healthy when the database and Redis are reachable', async () => {
    const response = await request(app.server).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', database: 'up', redis: 'up' });
  });
});
