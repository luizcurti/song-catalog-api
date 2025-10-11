import { Router } from 'express';

import { CreateSongController } from '@modules/song/useCases/createSong/createSongController';
import { DeleteSongController } from '@modules/song/useCases/deleteSong/deleteSongController';
import { EditSongController } from '@modules/song/useCases/editSong/editSongController';
import { ListAllSongController } from '@modules/song/useCases/listAllSong/listAllSongController';
import { ListSongByIdController } from '@modules/song/useCases/listSongById/listSongByIdController';

const songsRoutes = Router();
const songsPrefix = `/`;

const listAllSongController = new ListAllSongController();
const listSongByIdController = new ListSongByIdController();
const createSongController = new CreateSongController();
const editSongController = new EditSongController();
const deleteSongController = new DeleteSongController();

songsRoutes.get('/', listAllSongController.handle);
songsRoutes.get('/:id', listSongByIdController.handle);
songsRoutes.post('/', createSongController.handle);
songsRoutes.put('/:id', editSongController.handle);
songsRoutes.delete('/:id', deleteSongController.handle);

export { songsRoutes, songsPrefix };
