const fakeDataSource = {
  isInitialized: false,
  initialize: jest.fn(),
  destroy: jest.fn(),
  // songModule.ts eagerly builds the repository at import time.
  getRepository: jest.fn().mockReturnValue({}),
};

jest.mock('@shared/infra/database/dataSource', () => ({ AppDataSource: fakeDataSource }));
jest.mock('@shared/infra/redis', () => ({
  __esModule: true,
  default: { connect: jest.fn(), disconnect: jest.fn() },
}));

import { App } from '@shared/infra/app';
import cache from '@shared/infra/redis';

describe('App', () => {
  afterEach(() => {
    jest.clearAllMocks();
    fakeDataSource.isInitialized = false;
  });

  it('initializes the data source and connects the cache when not yet initialized', async () => {
    fakeDataSource.isInitialized = false;
    fakeDataSource.initialize.mockImplementationOnce(async () => {
      fakeDataSource.isInitialized = true;
    });

    const app = new App();
    await app.init();

    expect(fakeDataSource.initialize).toHaveBeenCalledTimes(1);
    expect(cache.connect).toHaveBeenCalledTimes(1);
  });

  it('skips re-initializing the data source when it is already initialized', async () => {
    fakeDataSource.isInitialized = true;

    const app = new App();
    await app.init();

    expect(fakeDataSource.initialize).not.toHaveBeenCalled();
    expect(cache.connect).toHaveBeenCalledTimes(1);
  });

  it('destroys the data source on shutdown when initialized', async () => {
    fakeDataSource.isInitialized = true;

    const app = new App();
    await app.shutdown();

    expect(cache.disconnect).toHaveBeenCalledTimes(1);
    expect(fakeDataSource.destroy).toHaveBeenCalledTimes(1);
  });

  it('skips destroying the data source on shutdown when not initialized', async () => {
    fakeDataSource.isInitialized = false;

    const app = new App();
    await app.shutdown();

    expect(fakeDataSource.destroy).not.toHaveBeenCalled();
  });
});
