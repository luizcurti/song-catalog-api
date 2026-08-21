import cache from '@shared/infra/redis';

describe('RedisCache (integration)', () => {
  const key = 'integration-test-key';

  beforeAll(async () => {
    await cache.connect();
  });

  afterEach(async () => {
    await cache.del(key);
  });

  afterAll(async () => {
    await cache.disconnect();
  });

  it('reports a healthy connection', async () => {
    await expect(cache.isHealthy()).resolves.toBe(true);
  });

  it('stores and retrieves a value', async () => {
    await cache.add(key, { hello: 'world' });

    const value = await cache.get(key);

    expect(value).not.toBeNull();
    expect(JSON.parse(value as string)).toEqual({ hello: 'world' });
  });

  it('returns null for a missing key', async () => {
    const value = await cache.get('does-not-exist');

    expect(value).toBeNull();
  });

  it('removes a stored value', async () => {
    await cache.add(key, { hello: 'world' });

    await cache.del(key);

    const value = await cache.get(key);
    expect(value).toBeNull();
  });
});
