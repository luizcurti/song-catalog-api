import { SongRepository } from '@modules/song/repositories/songRepository';
import { AppError } from '@errors/appError';
import cache from '@shared/infra/redis';

export class DeleteSongUseCase {
  constructor(private readonly songRepository: SongRepository) {}

  async execute(id: string): Promise<void> {
    const song = await this.songRepository.findByID(id);

    if (!song) {
      throw new AppError('Song does not exist', 404, 'Not Found');
    }

    await this.songRepository.remove(song);
    await cache.del(id);
  }
}
