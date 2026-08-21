import { CrudRepository } from '@shared/generic/repositories/crudRepository';

import { Song } from '../infra/typeorm/entities/Song';

export interface SongFilters {
  page: number;
  limit: number;
  name?: string;
  artist?: string;
  popularityMin?: number;
  popularityMax?: number;
}

export interface SongRepository extends CrudRepository<Song> {
  findPaginated(filters: SongFilters): Promise<{ data: Song[]; total: number }>;
}
