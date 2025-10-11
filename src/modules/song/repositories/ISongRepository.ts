import { IGenericRepository } from '@shared/generic/repositories/IGenericRepository'

import { Song } from '../infra/typeorm/entities/Song';

type ISongRepository = IGenericRepository<Song>;

export { ISongRepository };
