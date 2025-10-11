import "reflect-metadata";
import { container } from 'tsyringe';
import { AppError } from '@errors/appError';
import { ISongRepository } from '@modules/song/repositories/ISongRepository';
import { EditSongUseCase } from '@modules/song/useCases/editSong/editSongUseCase';
import cache from '@shared/infra/redis';
import { v4 as uuidv4 } from 'uuid';

import { createClient } from "redis";
type RedisClient = ReturnType<typeof createClient>;

jest.mock('@shared/infra/redis', () => ({
  add: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
}));

describe('EditSongUseCase', () => {
  let editSongUseCase: EditSongUseCase;
  let songRepository: jest.Mocked<ISongRepository>;

  beforeAll(() => {
    container.registerInstance<RedisClient>('RedisClient', {} as RedisClient);
  });

  beforeEach(() => {
    songRepository = {
      findByID: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<ISongRepository>;
    
    container.registerInstance<ISongRepository>('SongRepository', songRepository);

    editSongUseCase = container.resolve(EditSongUseCase);
  });

  it('should edit a song and update cache', async () => {
    const song = {
      id: uuidv4(),
      name: 'Old Song',
      artist: 'Old Artist',
      imageurl: 'Old Image URL',
      notes: 'Old Notes',
      popularity: '5',
      created_at: new Date(),
      updated_at: new Date(),
    };
    const updatedSong = {
      ...song,
      name: 'New Song',
      artist: 'New Artist',
      imageurl: 'New Image URL',
      notes: 'New Notes',
      popularity: '7',
    };

    songRepository.findByID.mockResolvedValueOnce(song);
    songRepository.update.mockResolvedValueOnce(updatedSong);

    const result = await editSongUseCase.execute({
      id: song.id,
      name: updatedSong.name,
      artist: updatedSong.artist,
      imageurl: updatedSong.imageurl,
      notes: updatedSong.notes,
      popularity: updatedSong.popularity,
    });

    expect(songRepository.findByID).toHaveBeenCalledWith(song.id);
    expect(songRepository.update).toHaveBeenCalledWith(updatedSong);
    expect(cache.del).toHaveBeenCalledWith(song.id);
    expect(cache.add).toHaveBeenCalledWith(updatedSong.id, updatedSong);
    expect(result).toEqual(updatedSong);
  });

  it('should throw an error if the song does not exist', async () => {
    const songID = 'song-id';
    songRepository.findByID.mockResolvedValueOnce(null);

    await expect(
      editSongUseCase.execute({
        id: songID,
        name: 'New Song',
        artist: 'New Artist',
        imageurl: 'New Image URL',
        notes: 'New Notes',
        popularity: '7',
      })
    ).rejects.toEqual(new AppError('Song does not exist', 404, 'Not Found'));
  });
});
