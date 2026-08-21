import { Request, Response } from 'express';

import { DeleteSongUseCase } from './deleteSongUseCase';

export class DeleteSongController {
  constructor(private readonly deleteSongUseCase: DeleteSongUseCase) {}

  handle = async (request: Request, response: Response): Promise<Response> => {
    const { id } = request.params;

    await this.deleteSongUseCase.execute(id);
    return response.status(204).send();
  };
}
