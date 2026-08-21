import { Request, Response } from 'express';

import { AppError } from '@errors/appError';

import { songSchema } from '../songSchema';
import { EditSongUseCase } from './editSongUseCase';

export class EditSongController {
  constructor(private readonly editSongUseCase: EditSongUseCase) {}

  handle = async (request: Request, response: Response): Promise<Response> => {
    const { id } = request.params;

    let validated;
    try {
      validated = await songSchema.validate(request.body, { abortEarly: true, stripUnknown: true });
    } catch (err) {
      throw new AppError((err as Error).message, 400, 'VALIDATIONS_FAILED');
    }

    const song = await this.editSongUseCase.execute(id, validated);
    return response.status(200).json(song);
  };
}
