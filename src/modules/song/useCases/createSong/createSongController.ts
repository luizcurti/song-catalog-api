import { container } from 'tsyringe';
import { CreateSongUseCase } from './createSongUseCase';
import { Request, Response } from 'express';
import { AppError } from '@errors/appError';
import * as Yup from 'yup';

class CreateSongController {
  async handle(request: Request, response: Response) {
    const { name, artist, imageurl, notes, popularity } = request.body;

    const schema = Yup.object({
      name: Yup.string().required(),
      artist: Yup.string().required(), 
      imageurl: Yup.string().required(),
      notes: Yup.string().required(),
      popularity: Yup.string().required()
    });

    const validation = await schema.validate(request.body);

    if (!validation)
      throw new AppError('Validations failed', 400, 'VALIDATIONS_FAILED');

    const createSongUseCase = container.resolve(CreateSongUseCase);

    await createSongUseCase.execute({
      name, 
      artist, 
      imageurl, 
      notes, 
      popularity
    });
    return response.status(200).json({ message: 'Song created successfully' });
  }
}

export { CreateSongController };
