import { randomUUID } from 'crypto';

import { SongRepository } from '@modules/song/repositories/songRepository';
import { DeleteSongUseCase } from '@modules/song/useCases/deleteSong/deleteSongUseCase';
import { AppError } from '@errors/appError';
import cache from '@shared/infra/redis';

jest.mock('@shared/infra/redis', () => ({
  __esModule: true,
  default: { add: jest.fn(), get: jest.fn(), del: jest.fn() },
}));

describe('DeleteSongUseCase', () => {
  let songRepository: jest.Mocked<SongRepository>;
  let deleteSongUseCase: DeleteSongUseCase;

  beforeEach(() => {
    songRepository = {
      create: jest.fn(),
      findByID: jest.fn(),
      findAll: jest.fn(),
      findPaginated: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    deleteSongUseCase = new DeleteSongUseCase(songRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deletes an existing song and evicts it from the cache', async () => {
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
    songRepository.findByID.mockResolvedValueOnce(song);

    await deleteSongUseCase.execute(id);

    expect(songRepository.remove).toHaveBeenCalledWith(song);
    expect(cache.del).toHaveBeenCalledWith(id);
  });

  it('throws a not-found error when the song does not exist', async () => {
    songRepository.findByID.mockResolvedValueOnce(null);

    await expect(deleteSongUseCase.execute(randomUUID())).rejects.toEqual(
      new AppError('Song does not exist', 404, 'Not Found'),
    );
    expect(songRepository.remove).not.toHaveBeenCalled();
  });
});
