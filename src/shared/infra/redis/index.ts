import { createClient, RedisClientType } from 'redis';

import config from '@config/index';
import { logger } from '@shared/infra/logger';

const TTL_SECONDS = 3600;

class RedisCache {
  private readonly client: RedisClientType;

  constructor() {
    this.client = createClient({
      socket: {
        host: config.redis.host,
        port: config.redis.port,
      },
    });

    this.client.on('connect', () => logger.info('redis connection established'));
    this.client.on('error', (error) => logger.error({ err: error }, 'redis error, service degraded'));
  }

  async connect(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.quit();
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      return (await this.client.ping()) === 'PONG';
    } catch {
      return false;
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async add(key: string, value: unknown): Promise<void> {
    await this.client.set(key, JSON.stringify(value), { EX: TTL_SECONDS });
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}

export default new RedisCache();
