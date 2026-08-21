import { randomUUID } from 'crypto';
import { Request, Response } from 'express';

import { DeleteSongController } from '@modules/song/useCases/deleteSong/deleteSongController';
import { DeleteSongUseCase } from '@modules/song/useCases/deleteSong/deleteSongUseCase';

describe('DeleteSongController', () => {
  let deleteSongUseCase: jest.Mocked<DeleteSongUseCase>;
  let deleteSongController: DeleteSongController;
  let response: Response;

  beforeEach(() => {
    deleteSongUseCase = { execute: jest.fn() } as unknown as jest.Mocked<DeleteSongUseCase>;
    deleteSongController = new DeleteSongController(deleteSongUseCase);
    response = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deletes a song and returns 204', async () => {
    const id = randomUUID();
    deleteSongUseCase.execute.mockResolvedValueOnce(undefined);

    const request = { params: { id } } as unknown as Request;
    await deleteSongController.handle(request, response);

    expect(deleteSongUseCase.execute).toHaveBeenCalledWith(id);
    expect(response.status).toHaveBeenCalledWith(204);
    expect(response.send).toHaveBeenCalled();
  });
});
