import "reflect-metadata";
import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { ListSongByIdUseCase } from '@modules/song/useCases/listSongById/listSongByIdUseCase';
import { ListSongByIdController } from '@modules/song/useCases/listSongById/listSongByIdController';
import { v4 as uuidv4 } from 'uuid';

jest.mock('tsyringe');
jest.mock('@modules/song/useCases/listSongById/listSongByIdUseCase', () => {
  return {
    ListSongByIdUseCase: jest.fn().mockImplementation(() => {
      return {
        execute: jest.fn()
      }
    })
  }
});

describe('ListSongByIdController', () => {
    let listSongByIdController: ListSongByIdController;
    let listSongByIdUseCase: ListSongByIdUseCase;
    let request: Request;
    let response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    var song = {
        id: expect.any(String),
        name: 'Song Name',
        artist: 'Song Artist',
        imageurl: 'https://example.com/song-image.jpg',
        notes: 'Song Notes',
        popularity: '10',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
    };

    beforeEach(() => {
        request = {} as Request;
        listSongByIdController = new ListSongByIdController();
    
        listSongByIdUseCase = {
          execute: jest.fn(),
        } as unknown as jest.Mocked<ListSongByIdUseCase>;
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
  
    it('should return a song by ID', async () => {
        const id =  String(uuidv4());

        const request = { params: { id } }; 

        jest.spyOn(container, 'resolve').mockReturnValue(listSongByIdUseCase);
        jest.spyOn(listSongByIdUseCase, 'execute').mockReturnValue(Promise.resolve(song));

        await listSongByIdController.handle(request as unknown as Request, response as Response);

        expect(listSongByIdUseCase.execute).toHaveBeenCalledWith({ id });
        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith(song);
    });
});
