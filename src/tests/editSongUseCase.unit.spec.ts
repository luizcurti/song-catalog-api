import { randomUUID } from 'crypto';

import { SongRepository } from '@modules/song/repositories/songRepository';
import { EditSongUseCase } from '@modules/song/useCases/editSong/editSongUseCase';
import { AppError } from '@errors/appError';
import cache from '@shared/infra/redis';

jest.mock('@shared/infra/redis', () => ({
  __esModule: true,
  default: { add: jest.fn(), get: jest.fn(), del: jest.fn() },
}));

describe('EditSongUseCase', () => {
  let songRepository: jest.Mocked<SongRepository>;
  let editSongUseCase: EditSongUseCase;

  beforeEach(() => {
    songRepository = {
      create: jest.fn(),
      findByID: jest.fn(),
      findAll: jest.fn(),
      findPaginated: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    editSongUseCase = new EditSongUseCase(songRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('updates an existing song and refreshes the cache', async () => {
    const id = randomUUID();
    const existingSong = {
      id,
      name: 'Old Name',
      artist: 'Old Artist',
      imageurl: 'https://example.com/old.jpg',
      notes: 'Old notes',
      popularity: 5,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const input = {
      name: 'New Name',
      artist: 'New Artist',
      imageurl: 'https://example.com/new.jpg',
      notes: 'New notes',
      popularity: 9,
    };
    const updatedSong = { ...existingSong, ...input };

    songRepository.findByID.mockResolvedValueOnce(existingSong);
    songRepository.update.mockResolvedValueOnce(updatedSong);

    const result = await editSongUseCase.execute(id, input);

    expect(songRepository.update).toHaveBeenCalledWith(expect.objectContaining(input));
    expect(result).toEqual(updatedSong);
    expect(cache.del).toHaveBeenCalledWith(id);
    expect(cache.add).toHaveBeenCalledWith(updatedSong.id, updatedSong);
  });

  it('throws a not-found error when the song does not exist', async () => {
    songRepository.findByID.mockResolvedValueOnce(null);

    await expect(
      editSongUseCase.execute(randomUUID(), {
        name: 'New Name',
        artist: 'New Artist',
        imageurl: 'https://example.com/new.jpg',
        notes: 'New notes',
        popularity: 9,
      }),
    ).rejects.toEqual(new AppError('Song does not exist', 404, 'Not Found'));
    expect(songRepository.update).not.toHaveBeenCalled();
  });
});
