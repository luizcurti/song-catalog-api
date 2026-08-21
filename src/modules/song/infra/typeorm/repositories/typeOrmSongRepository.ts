import { SongFilters, SongRepository } from '@modules/song/repositories/songRepository';
import { GenericRepository } from '@shared/generic/infra/typeorm/repositories/genericRepository';

import { Song } from '../entities/Song';

export class TypeOrmSongRepository extends GenericRepository<Song> implements SongRepository {
  constructor() {
    super(Song);
  }

  async findPaginated(filters: SongFilters): Promise<{ data: Song[]; total: number }> {
    const query = this.repository.createQueryBuilder('song');

    if (filters.name) {
      query.andWhere('song.name LIKE :name', { name: `%${filters.name}%` });
    }

    if (filters.artist) {
      query.andWhere('song.artist LIKE :artist', { artist: `%${filters.artist}%` });
    }

    if (filters.popularityMin !== undefined) {
      query.andWhere('song.popularity >= :popularityMin', { popularityMin: filters.popularityMin });
    }

    if (filters.popularityMax !== undefined) {
      query.andWhere('song.popularity <= :popularityMax', { popularityMax: filters.popularityMax });
    }

    query
      .orderBy('song.created_at', 'DESC')
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }
}
