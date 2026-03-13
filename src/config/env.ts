import { config as configDotenv } from 'dotenv';
import { resolve } from 'path';

configDotenv({
  path: resolve(__dirname, '../../.env'),
});

switch (process.env.ENV) {
  case 'LOCAL':
    console.log('[ENVIRONMENT] LOCAL');
    break;
  default:
    console.log(`[ENVIRONMENT] ${process.env.ENV || 'NOT SET'}`);
}
