import { container } from 'tsyringe';
import { ListSongByIdUseCase } from './listSongByIdUseCase';
import { Request, Response } from 'express';

class ListSongByIdController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;

    const listSongByIdUseCase = container.resolve(ListSongByIdUseCase);

    const listSong = await listSongByIdUseCase.execute({
      id,
    });
    return response.status(200).json(listSong);
  }
}

export { ListSongByIdController };
