import { createClient } from 'redis';
import { promisify } from 'util';

const TTL_SECONDS = 3600;

class RedisCache {
  private readonly cache: any;
  private readonly getAsync: (key: string) => Promise<string | null>;
  private readonly setAsync: (key: string, value: string, mode: string, duration: number) => Promise<unknown>;
  private readonly delAsync: (key: string) => Promise<number>;
  private readonly flushAsync: () => Promise<string>;

  constructor() {
    this.cache = createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: 6379
    });

    this.getAsync   = promisify(this.cache.get).bind(this.cache);
    this.setAsync   = promisify(this.cache.set).bind(this.cache);
    this.delAsync   = promisify(this.cache.del).bind(this.cache);
    this.flushAsync = promisify(this.cache.flushdb).bind(this.cache);

    this.cache.on('connect', () => { console.log('Redis connection established'); });

    this.cache.on('error', (error: any) => { console.error(`Redis error, service degraded: ${error}`); });
  }

  async get(key: string | number): Promise<string | null> {
    return this.getAsync(String(key));
  }

  async add(key: string | number, value: any): Promise<void> {
    await this.setAsync(String(key), JSON.stringify(value), 'EX', TTL_SECONDS);
  }

  async del(key: string | number): Promise<void> {
    await this.delAsync(String(key));
  }

  async flush(): Promise<void> {
    await this.flushAsync();
  }
}

export default new RedisCache();