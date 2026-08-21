const mockClient = {
  isOpen: false,
  connect: jest.fn(),
  quit: jest.fn(),
  ping: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  on: jest.fn(),
};

jest.mock('redis', () => ({
  createClient: jest.fn(() => mockClient),
}));

jest.mock('@config/index', () => ({
  __esModule: true,
  default: { redis: { host: 'localhost', port: 6379 } },
}));

const mockLogger = { info: jest.fn(), error: jest.fn() };
jest.mock('@shared/infra/logger', () => ({ logger: mockLogger }));

import cache from '@shared/infra/redis';

// `clearMocks: true` wipes mock.calls before every test, so capture the
// constructor-time `client.on(...)` registrations here, at module-eval time.
const clientEventHandlers = [...mockClient.on.mock.calls];

describe('RedisCache (unit)', () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockClient.isOpen = false;
  });

  it('logs on the underlying client "connect" and "error" events', () => {
    const onConnect = clientEventHandlers.find(([event]) => event === 'connect')?.[1];
    const onError = clientEventHandlers.find(([event]) => event === 'error')?.[1];
    const error = new Error('boom');

    onConnect?.();
    onError?.(error);

    expect(mockLogger.info).toHaveBeenCalledWith('redis connection established');
    expect(mockLogger.error).toHaveBeenCalledWith({ err: error }, 'redis error, service degraded');
  });

  it('connects only when the client is not already open', async () => {
    mockClient.isOpen = false;
    await cache.connect();
    expect(mockClient.connect).toHaveBeenCalledTimes(1);

    mockClient.isOpen = true;
    await cache.connect();
    expect(mockClient.connect).toHaveBeenCalledTimes(1);
  });

  it('disconnects only when the client is open', async () => {
    mockClient.isOpen = true;
    await cache.disconnect();
    expect(mockClient.quit).toHaveBeenCalledTimes(1);

    mockClient.isOpen = false;
    await cache.disconnect();
    expect(mockClient.quit).toHaveBeenCalledTimes(1);
  });

  it('reports healthy when the client responds PONG', async () => {
    mockClient.ping.mockResolvedValueOnce('PONG');

    await expect(cache.isHealthy()).resolves.toBe(true);
  });

  it('reports unhealthy when the ping call fails', async () => {
    mockClient.ping.mockRejectedValueOnce(new Error('connection lost'));

    await expect(cache.isHealthy()).resolves.toBe(false);
  });
});
