import "reflect-metadata";
import { container } from 'tsyringe';
import { AppError } from '@errors/appError';
import { ISongRepository } from '@modules/song/repositories/ISongRepository';
import { ListSongByIdUseCase } from '@modules/song/useCases/listSongById/listSongByIdUseCase';
import cache from '@shared/infra/redis';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from "redis";
type RedisClient = ReturnType<typeof createClient>;

jest.mock('@shared/infra/redis', () => ({
  add: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
}));

describe('ListSongByIdUseCase', () => {
  let songRepository: ISongRepository;
  let listSongByIdUseCase: ListSongByIdUseCase;

  beforeAll(() => {
    container.registerInstance<RedisClient>('RedisClient', {} as RedisClient);
  });

  beforeEach(() => {
    songRepository = {
      findByID: jest.fn(),
    } as unknown as jest.Mocked<ISongRepository>;

    container.registerInstance<ISongRepository>('SongRepository', songRepository);

    listSongByIdUseCase = container.resolve(ListSongByIdUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should list a song by its id', async () => {
    const song = {
      id: uuidv4(),
      name: 'Old Song',
      artist: 'Old Artist',
      imageurl: 'Old Image URL',
      notes: 'Old Notes',
      popularity: '5',
      created_at: new Date().toDateString(),
      updated_at: new Date().toDateString(),
    };

    const mockedSong = { ...song };

    jest.spyOn(cache, 'get').mockImplementation(() => Promise.resolve(JSON.stringify(song)));

    const result = await listSongByIdUseCase.execute({ id: song.id });

    expect(result).toEqual(song);
  });

  it('should fetch the song from the database if it is not in the cache', async () => {
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

    jest.spyOn(cache, 'get').mockImplementation(() => Promise.resolve(null));
    jest.spyOn(songRepository, 'findByID').mockImplementation(() => Promise.resolve(song));

    const result = await listSongByIdUseCase.execute({ id: song.id });

    expect(result).toEqual(song);
  });

  it('should throw an error if the song does not exist', async () => {
    const songId = '1';
    jest.spyOn(cache, 'get').mockImplementation(() => Promise.resolve(null));
    jest.spyOn(songRepository, 'findByID').mockImplementation(() => Promise.resolve(null));

    await expect(listSongByIdUseCase.execute({ id: songId }))
          .rejects.toEqual(new AppError('Song does not exist', 404, 'Not Found'));

  });
});