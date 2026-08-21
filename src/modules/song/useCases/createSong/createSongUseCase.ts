import { SongRepository } from '@modules/song/repositories/songRepository';
import cache from '@shared/infra/redis';

import { Song } from '../../infra/typeorm/entities/Song';
import { SongInput } from '../songSchema';

export class CreateSongUseCase {
  constructor(private readonly songRepository: SongRepository) {}

  async execute(input: SongInput): Promise<Song> {
    const song = await this.songRepository.create(input);
    await cache.add(song.id, song);
    return song;
  }
}
