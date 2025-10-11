import { container } from 'tsyringe';

import { ISongRepository } from '@modules/song/repositories/ISongRepository';
import { SongRepository } from '@modules/song/infra/typeorm/repositories/SongRepository';

container.registerSingleton<ISongRepository>(
  'SongRepository',
  SongRepository
);
