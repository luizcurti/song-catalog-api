import "reflect-metadata";
import { container } from 'tsyringe';
import { ISongRepository } from '@modules/song/repositories/ISongRepository';
import { CreateSongUseCase } from '@modules/song/useCases/createSong/createSongUseCase';
import { v4 as uuidv4 } from 'uuid';
import cache from '@shared/infra/redis';

import { createClient } from "redis";
type RedisClient = ReturnType<typeof createClient>;

jest.mock('@shared/infra/redis', () => ({
  add: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
}));

describe('CreateSongUseCase', () => {
  let songRepository: jest.Mocked<ISongRepository>;
  let createSongUseCase: CreateSongUseCase;

  beforeAll(() => {
    container.registerInstance<RedisClient>('RedisClient', {} as RedisClient);
  });

  beforeEach(() => {
    songRepository = {
      create: jest.fn(),
    } as unknown as jest.Mocked<ISongRepository>;

    container.registerInstance<ISongRepository>('SongRepository', songRepository);

    createSongUseCase = container.resolve(CreateSongUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new song', async () => {

    const song = {
      id: uuidv4(),
      name: 'Song Name',
      artist: 'Song Artist',
      imageurl: 'https://example.com/song-image.jpg',
      notes: 'Song Notes',
      popularity: '10',
    };

    const mockedSong = { ...song, created_at: new Date(), updated_at: new Date() };
    songRepository.create.mockResolvedValueOnce(mockedSong);

    const createdSong = await createSongUseCase.execute(song);

    expect(createdSong).toEqual({
      id: expect.any(String),
      name: 'Song Name',
      artist: 'Song Artist',
      imageurl: 'https://example.com/song-image.jpg',
      notes: 'Song Notes',
      popularity: '10',
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
  });
    expect(cache.add).toHaveBeenCalledWith(createdSong.id, createdSong);
  });
});