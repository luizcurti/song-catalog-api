import { AppError } from '@errors/appError';
import { ISongRepository } from '@modules/song/repositories/ISongRepository';
import { inject, injectable } from 'tsyringe';
import  cache from '@shared/infra/redis';
import { IRequest, IResponse } from './iEditSongDTO';

@injectable()
class EditSongUseCase {
  constructor(
    @inject('SongRepository')
    private songRepository: ISongRepository
  ) {}

  async execute({id, name, artist, imageurl, notes, popularity}: IRequest): Promise<IResponse> {
    const song = await this.songRepository.findByID(id);

    if (!song) 
      throw new AppError('Song does not exist', 404, 'Not Found');

    song.name = name;
    song.artist = artist;
    song.imageurl = imageurl;
    song.notes = notes;
    song.popularity = popularity;

    const songUpdated = await this.songRepository.update(song);

    if (songUpdated) {
      await cache.del(id);
      await cache.add(song.id, songUpdated);
    }

    return songUpdated;
  }
}

export { EditSongUseCase };
