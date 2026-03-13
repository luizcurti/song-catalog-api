import { container } from 'tsyringe';
import { EditSongUseCase } from './editSongUseCase';
import { Request, Response } from 'express';
import { AppError } from '@errors/appError';
import * as Yup from 'yup';

class EditSongController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;

    const schema = Yup.object({
      name: Yup.string().required(),
      artist: Yup.string().required(),
      imageurl: Yup.string().required(),
      notes: Yup.string().required(),
      popularity: Yup.number().min(0).max(10).required(),
    });

    let validated: Yup.InferType<typeof schema>;
    try {
      validated = await schema.validate(request.body, { abortEarly: true, stripUnknown: true });
    } catch (err) {
      throw new AppError((err as Yup.ValidationError).message, 400, 'VALIDATIONS_FAILED');
    }

    const editSongUseCase = container.resolve(EditSongUseCase);

    const song = await editSongUseCase.execute({ id, ...validated });
    return response.status(200).json(song);
  }
}

export { EditSongController };
