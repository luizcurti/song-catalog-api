import { SongRepository } from '@modules/song/repositories/songRepository';
import { AppError } from '@errors/appError';
import cache from '@shared/infra/redis';

import { Song } from '../../infra/typeorm/entities/Song';

export class ListSongByIdUseCase {
  constructor(private readonly songRepository: SongRepository) {}

  async execute(id: string): Promise<Song> {
    const cached = await cache.get(id);

    if (cached) {
      return JSON.parse(cached) as Song;
    }

    const song = await this.songRepository.findByID(id);

    if (!song) {
      throw new AppError('Song does not exist', 404, 'Not Found');
    }

    await cache.add(song.id, song);

    return song;
  }
}
