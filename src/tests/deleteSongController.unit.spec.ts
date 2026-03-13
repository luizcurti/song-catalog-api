import "reflect-metadata";
import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DeleteSongUseCase } from "@modules/song/useCases/deleteSong/deleteSongUseCase";
import { DeleteSongController } from "@modules/song/useCases/deleteSong/deleteSongController";

jest.mock('tsyringe');
jest.mock('@modules/song/useCases/deleteSong/deleteSongUseCase', () => {
  return {
    DeleteSongUseCase: jest.fn().mockImplementation(() => {
      return {
        execute: jest.fn()
      }
    })
  }
});

describe('DeleteSongController', () => {
    let deleteSongController: DeleteSongController;
    let deleteSongUseCase: DeleteSongUseCase;
    let request: Request;
    let response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as Response;

    beforeEach(() => {
      request = {} as Request;
      deleteSongController = new DeleteSongController();

      deleteSongUseCase = {
        execute: jest.fn(),
      } as unknown as jest.Mocked<DeleteSongUseCase>;
    });
  
  afterEach(() => {
      jest.clearAllMocks();
  });

  it('Should delete a song with successfully', async () => {
    const id =  String(uuidv4());
    const request = { params: { id } }; 

    jest.spyOn(container, 'resolve').mockReturnValue(deleteSongUseCase);
    jest.spyOn(deleteSongUseCase, 'execute').mockReturnValue(Promise.resolve("Deleted"));

    await deleteSongController.handle(request as unknown as Request, response as Response);

    expect(deleteSongUseCase.execute).toHaveBeenCalledWith({
      id: id,
    });

    expect(response.status).toHaveBeenCalledWith(204);
    expect(response.send).toHaveBeenCalled();
  });
});
