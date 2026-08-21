import { randomUUID } from 'crypto';

import { SongRepository } from '@modules/song/repositories/songRepository';
import { ListSongByIdUseCase } from '@modules/song/useCases/listSongById/listSongByIdUseCase';
import { AppError } from '@errors/appError';
import cache from '@shared/infra/redis';

jest.mock('@shared/infra/redis', () => ({
  __esModule: true,
  default: { add: jest.fn(), get: jest.fn(), del: jest.fn() },
}));

describe('ListSongByIdUseCase', () => {
  let songRepository: jest.Mocked<SongRepository>;
  let listSongByIdUseCase: ListSongByIdUseCase;

  beforeEach(() => {
    songRepository = {
      create: jest.fn(),
      findByID: jest.fn(),
      findAll: jest.fn(),
      findPaginated: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    listSongByIdUseCase = new ListSongByIdUseCase(songRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns the cached song without hitting the repository', async () => {
    const id = randomUUID();
    const song = {
      id,
      name: 'Song Name',
      artist: 'Song Artist',
      imageurl: 'https://example.com/song.jpg',
      notes: 'Notes',
      popularity: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    (cache.get as jest.Mock).mockResolvedValueOnce(JSON.stringify(song));

    const result = await listSongByIdUseCase.execute(id);

    expect(result).toEqual(song);
    expect(songRepository.findByID).not.toHaveBeenCalled();
  });

  it('falls back to the repository on a cache miss and populates the cache', async () => {
    const id = randomUUID();
    const song = {
      id,
      name: 'Song Name',
      artist: 'Song Artist',
      imageurl: 'https://example.com/song.jpg',
      notes: 'Notes',
      popularity: 5,
      created_at: new Date(),
      updated_at: new Date(),
    };
    (cache.get as jest.Mock).mockResolvedValueOnce(null);
    songRepository.findByID.mockResolvedValueOnce(song);

    const result = await listSongByIdUseCase.execute(id);

    expect(result).toEqual(song);
    expect(cache.add).toHaveBeenCalledWith(id, song);
  });

  it('throws a not-found error when the song does not exist anywhere', async () => {
    (cache.get as jest.Mock).mockResolvedValueOnce(null);
    songRepository.findByID.mockResolvedValueOnce(null);

    await expect(listSongByIdUseCase.execute(randomUUID())).rejects.toEqual(
      new AppError('Song does not exist', 404, 'Not Found'),
    );
  });
});
