import { inject, injectable } from 'tsyringe';
import { ISongRepository } from '@modules/song/repositories/ISongRepository';
import cache from '@shared/infra/redis';
import { IRequest, IResponse } from './iCreateSongDTO';

@injectable()
class CreateSongUseCase {
  constructor(
    @inject('SongRepository')
    private songRepository: ISongRepository
  ) {}

  async execute({ name, artist, imageurl, notes, popularity }: IRequest): Promise<IResponse> {
    const song = await this.songRepository.create({ name, artist, imageurl, notes, popularity });

    if (song.id)
      await cache.add(song.id, song);

    return song;
  }
}

export { CreateSongUseCase };
