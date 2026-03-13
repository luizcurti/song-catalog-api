import { ISongRepository } from '@modules/song/repositories/ISongRepository';
import { GenericRepository } from '@shared/generic/infra/typeorm/repositories/GenericRepository';

import { Song } from '../entities/Song';

class SongRepository
  extends GenericRepository<Song>
  implements ISongRepository
{
  constructor() {
    super(Song, 'default');
  }
}

export { SongRepository };
