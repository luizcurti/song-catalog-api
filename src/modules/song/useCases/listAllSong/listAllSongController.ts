import "reflect-metadata";
import { container } from 'tsyringe';
import { ListAllSongUseCase } from './listAllSongUseCase';
import { Request, Response } from 'express';

class ListAllSongController {
  async handle(request: Request, response: Response) {
    const listAllSongUseCase = container.resolve(ListAllSongUseCase);

    const listSongs = await listAllSongUseCase.execute();
    return response.status(200).json(listSongs);
  }
}

export { ListAllSongController };
