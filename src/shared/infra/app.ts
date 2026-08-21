import '@config/env';
import cors from 'cors';
import express, { Express } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';

import { AppDataSource } from '@shared/infra/database/dataSource';
import { openapiDocument } from '@shared/infra/http/docs/openapiDocument';
import { handlingErrors } from '@shared/infra/http/middlewares/handlingErrors';
import { handlingNotFound } from '@shared/infra/http/middlewares/handlingNotFound';
import { apiRateLimiter } from '@shared/infra/http/middlewares/rateLimiter';
import { healthRoute } from '@shared/infra/http/routes/healthRoute';
import { logger } from '@shared/infra/logger';
import cache from '@shared/infra/redis';

import { routes } from './http/routes/index';

export class App {
  public readonly server: Express;

  constructor() {
    this.server = express();
  }

  async init(): Promise<void> {
    await this.connectInfra();
    this.middlewares();
    this.routes();
  }

  async shutdown(): Promise<void> {
    await cache.disconnect();
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }

  private async connectInfra(): Promise<void> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      logger.info('database connected');
    }

    await cache.connect();
  }

  private middlewares(): void {
    this.server.use(cors());
    this.server.use(helmet());
    this.server.use(pinoHttp({ logger }));
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(express.json());
  }

  private routes(): void {
    this.server.use('/health', healthRoute);
    this.server.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));
    this.server.use('/api/music', apiRateLimiter, routes);
    this.server.use(handlingNotFound);
    this.server.use(handlingErrors);
  }
}
