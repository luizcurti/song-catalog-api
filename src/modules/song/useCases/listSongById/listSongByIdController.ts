import { Request, Response } from 'express';

import { ListSongByIdUseCase } from './listSongByIdUseCase';

export class ListSongByIdController {
  constructor(private readonly listSongByIdUseCase: ListSongByIdUseCase) {}

  handle = async (request: Request, response: Response): Promise<Response> => {
    const { id } = request.params;

    const song = await this.listSongByIdUseCase.execute(id);
    return response.status(200).json(song);
  };
}
