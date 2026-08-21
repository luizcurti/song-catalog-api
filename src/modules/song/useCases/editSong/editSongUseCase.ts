import { SongRepository } from '@modules/song/repositories/songRepository';
import { AppError } from '@errors/appError';
import cache from '@shared/infra/redis';

import { Song } from '../../infra/typeorm/entities/Song';
import { SongInput } from '../songSchema';

export class EditSongUseCase {
  constructor(private readonly songRepository: SongRepository) {}

  async execute(id: string, input: SongInput): Promise<Song> {
    const song = await this.songRepository.findByID(id);

    if (!song) {
      throw new AppError('Song does not exist', 404, 'Not Found');
    }

    Object.assign(song, input);

    const updatedSong = await this.songRepository.update(song);

    await cache.del(id);
    await cache.add(updatedSong.id, updatedSong);

    return updatedSong;
  }
}
