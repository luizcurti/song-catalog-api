import { Request, Response } from 'express';

import { AppError } from '@errors/appError';

import { songSchema } from '../songSchema';
import { CreateSongUseCase } from './createSongUseCase';

export class CreateSongController {
  constructor(private readonly createSongUseCase: CreateSongUseCase) {}

  handle = async (request: Request, response: Response): Promise<Response> => {
    let validated;
    try {
      validated = await songSchema.validate(request.body, { abortEarly: true, stripUnknown: true });
    } catch (err) {
      throw new AppError((err as Error).message, 400, 'VALIDATIONS_FAILED');
    }

    const song = await this.createSongUseCase.execute(validated);
    return response.status(201).json(song);
  };
}
