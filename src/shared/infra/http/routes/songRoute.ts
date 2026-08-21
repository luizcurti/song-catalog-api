import { Router } from 'express';

import {
  createSongController,
  deleteSongController,
  editSongController,
  listAllSongController,
  listSongByIdController,
} from '@modules/song/songModule';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/authentication';

const songsRoutes = Router();
const songsPrefix = '/';

songsRoutes.get('/', listAllSongController.handle);
songsRoutes.get('/:id', listSongByIdController.handle);
songsRoutes.post('/', ensureAuthenticated, createSongController.handle);
songsRoutes.put('/:id', ensureAuthenticated, editSongController.handle);
songsRoutes.delete('/:id', ensureAuthenticated, deleteSongController.handle);

export { songsRoutes, songsPrefix };
