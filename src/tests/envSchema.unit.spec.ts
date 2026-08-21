import { validateEnv } from '@config/envSchema';

const validEnv = {
  DB_HOST: 'localhost',
  DB_PORT: '3306',
  DB_USER: 'root',
  DB_PASSWORD: 'root',
  DB_DATABASE: 'music',
  X_API_KEY: 'secret',
};

describe('validateEnv', () => {
  it('parses valid environment variables and applies defaults', () => {
    const env = validateEnv(validEnv);

    expect(env).toMatchObject({
      NODE_ENV: 'development',
      PORT: 3005,
      DB_HOST: 'localhost',
      DB_PORT: 3306,
      REDIS_HOST: 'localhost',
      REDIS_PORT: 6379,
      X_API_KEY: 'secret',
    });
  });

  it('respects explicitly provided values over defaults', () => {
    const env = validateEnv({ ...validEnv, PORT: '4000', REDIS_HOST: 'redis-server', REDIS_PORT: '6380' });

    expect(env.PORT).toBe(4000);
    expect(env.REDIS_HOST).toBe('redis-server');
    expect(env.REDIS_PORT).toBe(6380);
  });

  it('throws a descriptive error when a required variable is missing', () => {
    const { DB_HOST, ...incomplete } = validEnv;
    void DB_HOST;

    expect(() => validateEnv(incomplete)).toThrow(/Invalid environment configuration/);
  });

  it('throws when NODE_ENV has an unsupported value', () => {
    expect(() => validateEnv({ ...validEnv, NODE_ENV: 'staging' })).toThrow(/Invalid environment configuration/);
  });
});
