import "reflect-metadata";
import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '@errors/appError';
import * as Yup from 'yup';
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
            popularity: 5,
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
              popularity: 5,
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
            popularity: 5,
        });

        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith(mockSong);
    });

    it('should throw a validation error when editing a song with invalid data', async () => {
        const id = String(uuidv4());

        const schemaMock = {
            required: jest.fn().mockReturnThis(),
            string: jest.fn().mockReturnThis(),
            validate: jest.fn().mockRejectedValue(
                new Yup.ValidationError('name is a required field', '', 'name')
            ),
        };

        jest.spyOn(Yup, 'object').mockReturnValue(schemaMock as any);

        const requestMock = {
            params: { id },
            body: { name: '', artist: 'Artist', imageurl: 'img.jpg', notes: 'Notes', popularity: 5 },
        } as unknown as Request;

        const ctrl = new EditSongController();

        await expect(ctrl.handle(requestMock, response as Response)).rejects.toEqual(
            new AppError('name is a required field', 400, 'VALIDATIONS_FAILED')
        );

        expect(response.status).not.toHaveBeenCalled();
        expect(response.json).not.toHaveBeenCalled();
    });
});
