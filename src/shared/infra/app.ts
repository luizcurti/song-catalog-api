import '@config/env';
import express from 'express';
import 'express-async-errors';

import helmet from 'helmet';
import cors from 'cors';

import Database from '@shared/infra/database/index';

import { routes } from './http/routes/index';
import { handlingNotFound } from '@shared/infra/http/middlewares/handlingNotFound';

import '@shared/containers';

class App {
  public server: any;

  constructor() {
    this.server = express();
  }

  async init() {
    await this.database();
    this.middlewares();
    this.routes();
  }

  async database() {
    console.log('[SERVER] DATABASE CONNECTING');
    await Database.init();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(helmet());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(express.json());

    console.log('[SERVER] MIDDLEWARES REGISTERED');
  }

  routes() {
    this.server.use('/api/music', routes);
    this.server.use(handlingNotFound);

    console.log('[SERVER] ROUTES REGISTERED');
  }
}

export { App };
