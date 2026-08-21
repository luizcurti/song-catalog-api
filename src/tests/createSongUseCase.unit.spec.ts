import { randomUUID } from 'crypto';

import { SongRepository } from '@modules/song/repositories/songRepository';
import { CreateSongUseCase } from '@modules/song/useCases/createSong/createSongUseCase';
import cache from '@shared/infra/redis';

jest.mock('@shared/infra/redis', () => ({
  __esModule: true,
  default: { add: jest.fn(), get: jest.fn(), del: jest.fn() },
}));

describe('CreateSongUseCase', () => {
  let songRepository: jest.Mocked<SongRepository>;
  let createSongUseCase: CreateSongUseCase;

  beforeEach(() => {
    songRepository = {
      create: jest.fn(),
      findByID: jest.fn(),
      findAll: jest.fn(),
      findPaginated: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    createSongUseCase = new CreateSongUseCase(songRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates a song and stores it in the cache', async () => {
    const input = {
      name: 'Song Name',
      artist: 'Song Artist',
      imageurl: 'https://example.com/song-image.jpg',
      notes: 'Song Notes',
      popularity: 10,
    };
    const song = { id: randomUUID(), ...input, created_at: new Date(), updated_at: new Date() };
    songRepository.create.mockResolvedValueOnce(song);

    const result = await createSongUseCase.execute(input);

    expect(songRepository.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(song);
    expect(cache.add).toHaveBeenCalledWith(song.id, song);
  });
});
