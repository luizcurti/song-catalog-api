import { TypeOrmSongRepository } from './infra/typeorm/repositories/typeOrmSongRepository';
import { CreateSongController } from './useCases/createSong/createSongController';
import { CreateSongUseCase } from './useCases/createSong/createSongUseCase';
import { DeleteSongController } from './useCases/deleteSong/deleteSongController';
import { DeleteSongUseCase } from './useCases/deleteSong/deleteSongUseCase';
import { EditSongController } from './useCases/editSong/editSongController';
import { EditSongUseCase } from './useCases/editSong/editSongUseCase';
import { ListAllSongController } from './useCases/listAllSong/listAllSongController';
import { ListAllSongUseCase } from './useCases/listAllSong/listAllSongUseCase';
import { ListSongByIdController } from './useCases/listSongById/listSongByIdController';
import { ListSongByIdUseCase } from './useCases/listSongById/listSongByIdUseCase';

const songRepository = new TypeOrmSongRepository();

export const createSongController = new CreateSongController(new CreateSongUseCase(songRepository));
export const editSongController = new EditSongController(new EditSongUseCase(songRepository));
export const deleteSongController = new DeleteSongController(new DeleteSongUseCase(songRepository));
export const listAllSongController = new ListAllSongController(new ListAllSongUseCase(songRepository));
export const listSongByIdController = new ListSongByIdController(new ListSongByIdUseCase(songRepository));
