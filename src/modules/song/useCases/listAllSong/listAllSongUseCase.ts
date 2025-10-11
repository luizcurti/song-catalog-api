import "reflect-metadata";
import { ISongRepository } from '@modules/song/repositories/ISongRepository';
import { inject, injectable } from 'tsyringe';
import { IResponse } from '../createSong/iCreateSongDTO';

@injectable()
class ListAllSongUseCase {
  constructor(
    @inject('SongRepository')
    private songRepository: ISongRepository
  ) {}

  async execute(): Promise<IResponse[]> {
    return await this.songRepository.findAll();
  }
}

export { ListAllSongUseCase };
