import { Request, Response } from 'express';

import { AppError } from '@errors/appError';
import { ListAllSongController } from '@modules/song/useCases/listAllSong/listAllSongController';
import { ListAllSongUseCase } from '@modules/song/useCases/listAllSong/listAllSongUseCase';

describe('ListAllSongController', () => {
  let listAllSongUseCase: jest.Mocked<ListAllSongUseCase>;
  let listAllSongController: ListAllSongController;
  let response: Response;

  beforeEach(() => {
    listAllSongUseCase = { execute: jest.fn() } as unknown as jest.Mocked<ListAllSongUseCase>;
    listAllSongController = new ListAllSongController(listAllSongUseCase);
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('applies default pagination when no query params are given', async () => {
    const page = { data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } } as never;
    listAllSongUseCase.execute.mockResolvedValueOnce(page);

    const request = { query: {} } as unknown as Request;
    await listAllSongController.handle(request, response);

    expect(listAllSongUseCase.execute).toHaveBeenCalledWith(expect.objectContaining({ page: 1, limit: 20 }));
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(page);
  });

  it('parses and forwards filter query params', async () => {
    listAllSongUseCase.execute.mockResolvedValueOnce({} as never);

    const request = { query: { page: '2', limit: '5', artist: 'Queen', popularityMin: '3' } } as unknown as Request;
    await listAllSongController.handle(request, response);

    expect(listAllSongUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2, limit: 5, artist: 'Queen', popularityMin: 3 }),
    );
  });

  it('throws a validation error for an invalid query param', async () => {
    const request = { query: { limit: '1000' } } as unknown as Request;

    await expect(listAllSongController.handle(request, response)).rejects.toBeInstanceOf(AppError);
    expect(listAllSongUseCase.execute).not.toHaveBeenCalled();
  });
});
