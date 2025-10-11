import { AppError } from '@errors/appError';
import { ISongRepository } from '@modules/song/repositories/ISongRepository';
import { inject, injectable } from 'tsyringe';
import  cache from '@shared/infra/redis';
import { IRequest } from './iDeleteSongDTO';

@injectable()
class DeleteSongUseCase {
  constructor(
    @inject('SongRepository')
    private songRepository: ISongRepository
  ) {}

  async execute({id}: IRequest): Promise<string>{
    const song = await this.songRepository.findByID(id);

    if (!song) 
      throw new AppError('Song does not exist', 404, 'Not Found');

    await this.songRepository.remove(song);
    await cache.del(id);

    return "Deleted";
  }
}

export { DeleteSongUseCase };
