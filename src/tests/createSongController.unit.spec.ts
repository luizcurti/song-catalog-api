import { randomUUID } from 'crypto';
import { Request, Response } from 'express';

import { AppError } from '@errors/appError';
import { CreateSongController } from '@modules/song/useCases/createSong/createSongController';
import { CreateSongUseCase } from '@modules/song/useCases/createSong/createSongUseCase';

describe('CreateSongController', () => {
  let createSongUseCase: jest.Mocked<CreateSongUseCase>;
  let createSongController: CreateSongController;
  let response: Response;

  beforeEach(() => {
    createSongUseCase = { execute: jest.fn() } as unknown as jest.Mocked<CreateSongUseCase>;
    createSongController = new CreateSongController(createSongUseCase);
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates a song successfully', async () => {
    const body = {
      name: 'Song Name',
      artist: 'Song Artist',
      imageurl: 'https://example.com/song-image.jpg',
      notes: 'Song Notes',
      popularity: 10,
    };
    const song = { id: randomUUID(), ...body, created_at: new Date(), updated_at: new Date() };
    createSongUseCase.execute.mockResolvedValueOnce(song);

    const request = { body } as Request;
    await createSongController.handle(request, response);

    expect(createSongUseCase.execute).toHaveBeenCalledWith(body);
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith(song);
  });

  it('strips unknown fields before calling the use case', async () => {
    const body = {
      name: 'Song Name',
      artist: 'Song Artist',
      imageurl: 'https://example.com/song-image.jpg',
      notes: 'Song Notes',
      popularity: 10,
      unknownField: 'should be stripped',
    };
    createSongUseCase.execute.mockResolvedValueOnce({} as never);

    const request = { body } as Request;
    await createSongController.handle(request, response);

    expect(createSongUseCase.execute).toHaveBeenCalledWith({
      name: 'Song Name',
      artist: 'Song Artist',
      imageurl: 'https://example.com/song-image.jpg',
      notes: 'Song Notes',
      popularity: 10,
    });
  });

  it('throws a validation error when required fields are missing', async () => {
    const request = { body: { artist: 'Song Artist' } } as Request;

    await expect(createSongController.handle(request, response)).rejects.toBeInstanceOf(AppError);
    expect(createSongUseCase.execute).not.toHaveBeenCalled();
    expect(response.status).not.toHaveBeenCalled();
  });

  it('throws a validation error when popularity is out of range', async () => {
    const request = {
      body: {
        name: 'Song Name',
        artist: 'Song Artist',
        imageurl: 'https://example.com/song-image.jpg',
        notes: 'Song Notes',
        popularity: 11,
      },
    } as Request;

    await expect(createSongController.handle(request, response)).rejects.toMatchObject({ type: 'VALIDATIONS_FAILED' });
  });
});
