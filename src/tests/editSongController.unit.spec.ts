import "reflect-metadata";
import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { EditSongUseCase } from "@modules/song/useCases/editSong/editSongUseCase";
import { EditSongController } from "@modules/song/useCases/editSong/editSongController";

jest.mock('tsyringe');
jest.mock('@modules/song/useCases/editSong/editSongUseCase', () => {
  return {
    EditSongUseCase: jest.fn().mockImplementation(() => {
      return {
        execute: jest.fn()
      }
    })
  }
});

describe('EditSongController', () => {
    let editSongController: EditSongController;
    let editSongUseCase: EditSongUseCase;
    let request: Request;
    let response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    beforeEach(() => {
        request = {} as Request;
        editSongController = new EditSongController();
    
        editSongUseCase = {
          execute: jest.fn(),
        } as unknown as jest.Mocked<EditSongUseCase>;
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });    

    it('should update a song successfully', async () => {
        const id = String(uuidv4());    

        const mockSong = {
            id: '1',
            name: 'New song',
            artist: 'New artist',
            imageurl: 'new-image.jpg',
            notes: 'New notes',
            popularity: '5',
            created_at: new Date(),
            updated_at: new Date(),
        };

        jest.spyOn(container, 'resolve').mockReturnValue(editSongUseCase);
        jest.spyOn(editSongUseCase, 'execute').mockReturnValue(Promise.resolve(mockSong));

        const requestMock = {
            params: { id: id },
            body: {
              name: 'New song',
              artist: 'New artist',
              imageurl: 'new-image.jpg',
              notes: 'New notes',
              popularity: '5',
          },
        } as unknown as Request; 

        const editSongController = new EditSongController();

        await editSongController.handle(requestMock, response);

        expect(editSongUseCase.execute).toHaveBeenCalledWith({
            id: id,
            name: 'New song',
            artist: 'New artist',
            imageurl: 'new-image.jpg',
            notes: 'New notes',
            popularity: '5',
        });

        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith({ message: 'Song updated successfully' });
    });
});
