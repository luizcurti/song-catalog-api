import { randomUUID } from 'crypto';
import { Request, Response } from 'express';

import { AppError } from '@errors/appError';
import { EditSongController } from '@modules/song/useCases/editSong/editSongController';
import { EditSongUseCase } from '@modules/song/useCases/editSong/editSongUseCase';

describe('EditSongController', () => {
  let editSongUseCase: jest.Mocked<EditSongUseCase>;
  let editSongController: EditSongController;
  let response: Response;

  beforeEach(() => {
    editSongUseCase = { execute: jest.fn() } as unknown as jest.Mocked<EditSongUseCase>;
    editSongController = new EditSongController(editSongUseCase);
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('updates a song successfully', async () => {
    const id = randomUUID();
    const body = {
      name: 'Song Name',
      artist: 'Song Artist',
      imageurl: 'https://example.com/song-image.jpg',
      notes: 'Song Notes',
      popularity: 7,
    };
    const song = { id, ...body, created_at: new Date(), updated_at: new Date() };
    editSongUseCase.execute.mockResolvedValueOnce(song);

    const request = { params: { id }, body } as unknown as Request;
    await editSongController.handle(request, response);

    expect(editSongUseCase.execute).toHaveBeenCalledWith(id, body);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(song);
  });

  it('throws a validation error when required fields are missing', async () => {
    const request = { params: { id: randomUUID() }, body: {} } as unknown as Request;

    await expect(editSongController.handle(request, response)).rejects.toBeInstanceOf(AppError);
    expect(editSongUseCase.execute).not.toHaveBeenCalled();
  });
});
