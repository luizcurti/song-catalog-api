import { container } from 'tsyringe';
import { EditSongUseCase } from './editSongUseCase';
import { Request, Response } from 'express';

class EditSongController {
  async handle(request: Request, response: Response) {
    const editSongUseCase = container.resolve(EditSongUseCase);
    const { id } = request.params;
    const { name, artist, imageurl, notes, popularity } = request.body;

    await editSongUseCase.execute({
      id,
      name, 
      artist, 
      imageurl, 
      notes, 
      popularity
    });
    return response.status(200).json({ message: 'Song updated successfully' });
  }
}

export { EditSongController };
