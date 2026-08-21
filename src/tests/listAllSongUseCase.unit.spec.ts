import { randomUUID } from 'crypto';

import { SongRepository } from '@modules/song/repositories/songRepository';
import { ListAllSongUseCase } from '@modules/song/useCases/listAllSong/listAllSongUseCase';

describe('ListAllSongUseCase', () => {
  let songRepository: jest.Mocked<SongRepository>;
  let listAllSongUseCase: ListAllSongUseCase;

  beforeEach(() => {
    songRepository = {
      create: jest.fn(),
      findByID: jest.fn(),
      findAll: jest.fn(),
      findPaginated: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    listAllSongUseCase = new ListAllSongUseCase(songRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns a page of songs with pagination metadata', async () => {
    const songs = [
      {
        id: randomUUID(),
        name: 'Song A',
        artist: 'Artist A',
        imageurl: 'https://example.com/a.jpg',
        notes: 'Notes A',
        popularity: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    songRepository.findPaginated.mockResolvedValueOnce({ data: songs, total: 7 });

    const result = await listAllSongUseCase.execute({ page: 2, limit: 1 });

    expect(songRepository.findPaginated).toHaveBeenCalledWith({ page: 2, limit: 1 });
    expect(result).toEqual({ data: songs, meta: { page: 2, limit: 1, total: 7, totalPages: 7 } });
  });
});
