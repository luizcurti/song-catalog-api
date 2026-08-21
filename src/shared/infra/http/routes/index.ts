import { Router } from 'express';

import { songsPrefix, songsRoutes } from './songRoute';

const routes = Router();

routes.use(songsPrefix, songsRoutes);

export { routes };
