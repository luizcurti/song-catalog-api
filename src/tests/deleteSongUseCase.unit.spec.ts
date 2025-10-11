import "reflect-metadata";
import { container } from 'tsyringe';
import { AppError } from '@errors/appError';
import { ISongRepository } from '@modules/song/repositories/ISongRepository';
import { DeleteSongUseCase } from '@modules/song/useCases/deleteSong/deleteSongUseCase';
import cache from '@shared/infra/redis';
import { v4 as uuidv4 } from 'uuid';

import { createClient } from "redis";
type RedisClient = ReturnType<typeof createClient>;

jest.mock('@shared/infra/redis', () => ({
  add: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
}));

describe('DeleteSongUseCase', () => {
  let songRepository: jest.Mocked<ISongRepository>;
  let deleteSongUseCase: DeleteSongUseCase;

  beforeAll(() => {
    container.registerInstance<RedisClient>('RedisClient', {} as RedisClient);
  });

  beforeEach(() => {
    songRepository = {
      findByID: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<ISongRepository>;

    container.registerInstance<ISongRepository>('SongRepository', songRepository);

    deleteSongUseCase = container.resolve(DeleteSongUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a song and remove from cache', async () => {
    const song = {
      id: uuidv4(),
      name: 'Song Name',
      artist: 'Song Artist',
      imageurl: 'https://example.com/song-image.jpg',
      notes: 'Song Notes',
      popularity: '10',
      created_at: new Date(),
      updated_at: new Date(),
    };
    const mockedSong = { ...song };

    songRepository.findByID.mockResolvedValueOnce(mockedSong);

    const result = await deleteSongUseCase.execute({ id: song.id });

    expect(songRepository.findByID).toHaveBeenCalledWith(song.id);
    expect(songRepository.remove).toHaveBeenCalledWith(song);
    expect(cache.del).toHaveBeenCalledWith(song.id);
    expect(result).toBe('Deleted');
  });

  it('should throw an error if the song does not exist', async () => {
    const songID = 'song-id';
    songRepository.findByID.mockResolvedValueOnce(null);

    await expect(deleteSongUseCase.execute({ id: songID })).rejects.toEqual(
      new AppError('Song does not exist', 404, 'Not Found')
    );
  });
});