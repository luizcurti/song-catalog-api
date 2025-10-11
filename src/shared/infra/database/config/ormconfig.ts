import '@config/env';
import config from '@config/index';

const { type, port, host, username, password, names } = config.database;
const { music } = names;

export default [
  {
    name: 'default',
    type,
    host,
    port,
    username,
    password,
    database: music,
    migrations: [
      process.env.NODE_ENV === 'production' 
        ? 'dist/shared/infra/database/migrations/*.js'
        : 'src/shared/infra/database/migrations/*.ts'
    ],
    entities: [
      process.env.NODE_ENV === 'production' 
        ? 'dist/modules/**/entities/*.js'
        : 'src/modules/**/entities/*.ts'
    ],
    cli: {
      migrationsDir: 'src/shared/infra/database/migrations',
    },
  },
];
