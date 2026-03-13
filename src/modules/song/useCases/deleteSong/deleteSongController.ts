import { container } from 'tsyringe';
import { DeleteSongUseCase } from './deleteSongUseCase';
import { Request, Response } from 'express';

class DeleteSongController {
  async handle(request: Request, response: Response) {
    let { id } = request.params;

    const deleteSongUseCase = container.resolve(DeleteSongUseCase);

    await deleteSongUseCase.execute({
      id
    });
    return response.status(204).send();
  }
}

export { DeleteSongController };
