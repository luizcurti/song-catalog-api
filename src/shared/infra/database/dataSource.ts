import 'reflect-metadata';
import '@config/env';
import { DataSource } from 'typeorm';
import config from '@config/index';

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: config.database.type,
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  migrations: [
    isProduction ? 'dist/shared/infra/database/migrations/*.js' : 'src/shared/infra/database/migrations/*.ts',
  ],
  entities: [isProduction ? 'dist/modules/**/entities/*.js' : 'src/modules/**/entities/*.ts'],
});
