import { SongRepository } from '@modules/song/repositories/songRepository';
import { paginate, Paginated } from '@shared/generic/pagination';

import { Song } from '../../infra/typeorm/entities/Song';
import { ListSongsQuery } from './listSongsQuery';

export class ListAllSongUseCase {
  constructor(private readonly songRepository: SongRepository) {}

  async execute(query: ListSongsQuery): Promise<Paginated<Song>> {
    const { data, total } = await this.songRepository.findPaginated(query);

    return paginate(data, total, query.page, query.limit);
  }
}
