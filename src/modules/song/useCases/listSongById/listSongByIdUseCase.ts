import { AppError } from '@errors/appError';
import { ISongRepository } from '@modules/song/repositories/ISongRepository';
import { inject, injectable } from 'tsyringe';
import  cache from '@shared/infra/redis';
import { IRequest, IResponse } from './iListSongDTO';

@injectable()
class ListSongByIdUseCase {
  constructor(
    @inject('SongRepository')
    private songRepository: ISongRepository
  ) {}

  async execute({id}: IRequest): Promise<IResponse> {
    let song;

    song = await cache.get(id);

    if (song) 
      song = JSON.parse(song)

      if (!song) 
        song = await this.songRepository.findByID(id);
  
    if (!song) 
      throw new AppError('Song does not exist', 404, 'Not Found');

    return song;
  }
}

export { ListSongByIdUseCase };
