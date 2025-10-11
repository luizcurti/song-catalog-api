import { inject, injectable } from 'tsyringe';
import { ISongRepository } from '@modules/song/repositories/ISongRepository';
import  cache from '@shared/infra/redis';
import { IRequest, IResponse } from './iCreateSongDTO';
import { v4 as uuidv4 } from 'uuid';

@injectable()
class CreateSongUseCase {
  constructor(
    @inject('SongRepository')
    private songRepository: ISongRepository
  ) {}

  async execute({name, artist, imageurl, notes, popularity}: IRequest): Promise<IResponse> {
    const id = uuidv4();
    
    const song = await this.songRepository.create({id, name, artist, imageurl, notes, popularity});

    if (song.id) 
      await cache.add(song.id, song);

    return song;
  }
}

export { CreateSongUseCase };
