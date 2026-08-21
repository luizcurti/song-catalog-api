import { randomUUID } from 'crypto';
import { Request, Response } from 'express';

import { ListSongByIdController } from '@modules/song/useCases/listSongById/listSongByIdController';
import { ListSongByIdUseCase } from '@modules/song/useCases/listSongById/listSongByIdUseCase';

describe('ListSongByIdController', () => {
  let listSongByIdUseCase: jest.Mocked<ListSongByIdUseCase>;
  let listSongByIdController: ListSongByIdController;
  let response: Response;

  beforeEach(() => {
    listSongByIdUseCase = { execute: jest.fn() } as unknown as jest.Mocked<ListSongByIdUseCase>;
    listSongByIdController = new ListSongByIdController(listSongByIdUseCase);
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns the song with status 200', async () => {
    const id = randomUUID();
    const song = { id } as never;
    listSongByIdUseCase.execute.mockResolvedValueOnce(song);

    const request = { params: { id } } as unknown as Request;
    await listSongByIdController.handle(request, response);

    expect(listSongByIdUseCase.execute).toHaveBeenCalledWith(id);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(song);
  });
});
