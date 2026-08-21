import * as Yup from 'yup';

const envSchema = Yup.object({
  NODE_ENV: Yup.string().oneOf(['development', 'test', 'production']).default('development'),
  PORT: Yup.number().integer().positive().default(3005),
  DB_HOST: Yup.string().required(),
  DB_PORT: Yup.number().integer().positive().required(),
  DB_USER: Yup.string().required(),
  DB_PASSWORD: Yup.string().required(),
  DB_DATABASE: Yup.string().required(),
  REDIS_HOST: Yup.string().default('localhost'),
  REDIS_PORT: Yup.number().integer().positive().default(6379),
  X_API_KEY: Yup.string().required(),
});

export type Env = Yup.InferType<typeof envSchema>;

export function validateEnv(source: NodeJS.ProcessEnv): Env {
  try {
    return envSchema.validateSync(source, { abortEarly: false, stripUnknown: true });
  } catch (error) {
    const details = (error as Yup.ValidationError).errors.join('; ');
    throw new Error(`Invalid environment configuration: ${details}`);
  }
}
