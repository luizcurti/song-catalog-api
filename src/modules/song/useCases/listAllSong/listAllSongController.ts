import { Request, Response } from 'express';

import { AppError } from '@errors/appError';

import { listSongsQuerySchema } from './listSongsQuery';
import { ListAllSongUseCase } from './listAllSongUseCase';

export class ListAllSongController {
  constructor(private readonly listAllSongUseCase: ListAllSongUseCase) {}

  handle = async (request: Request, response: Response): Promise<Response> => {
    let query;
    try {
      query = await listSongsQuerySchema.validate(request.query, { abortEarly: true, stripUnknown: true });
    } catch (err) {
      throw new AppError((err as Error).message, 400, 'VALIDATIONS_FAILED');
    }

    const songs = await this.listAllSongUseCase.execute(query);
    return response.status(200).json(songs);
  };
}
