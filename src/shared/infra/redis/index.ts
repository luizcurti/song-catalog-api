import { createClient } from 'redis';

class RedisCache {
  private readonly cache: any;

   constructor() {
    this.cache = createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: 6379
    });

    this.cache.on("connect", () => { console.log(`Redis connection established`); });

    this.cache.on("error", (error: any) => { console.error(`Redis error, service degraded: ${error}`); });
  }

  async get(key: string | number) {
    return this.cache.get(key);
  }

  async add(key: string | number, value: any) {
    this.cache.set(key, JSON.stringify(value));
  }

  async del(key: string | number){
    this.cache.del(key);
  }

  async flush(){
    this.cache.flush(); 
  }
} 

export default new RedisCache();