import './env';
import { validateEnv } from './envSchema';

const env = validateEnv(process.env);

const config = {
  database: {
    type: 'mysql' as const,
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    name: env.DB_DATABASE,
  },
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
  },
  server: {
    port: env.PORT,
  },
  auth: {
    apiKey: env.X_API_KEY,
  },
} as const;

export type Config = typeof config;
export default config;
