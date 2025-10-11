import { Router } from 'express';
import { handlingErrors } from '@shared/infra/http/middlewares/handlingErrors';

import { songsRoutes, songsPrefix } from './songRoute';

const routes = Router();

routes.use(songsPrefix, songsRoutes);

routes.use(handlingErrors);

export { routes };
