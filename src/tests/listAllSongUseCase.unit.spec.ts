import "reflect-metadata";
import { container } from 'tsyringe';
import { ISongRepository } from '@modules/song/repositories/ISongRepository';
import { ListAllSongUseCase } from '@modules/song/useCases/listAllSong/listAllSongUseCase';
import { v4 as uuidv4 } from 'uuid';

describe('ListAllSongUseCase', () => {
  let listAllSongUseCase: ListAllSongUseCase;
  let songRepository: jest.Mocked<ISongRepository>;;

  beforeEach(() => {
    songRepository = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<ISongRepository>;

    container.registerInstance<ISongRepository>('SongRepository', songRepository);

    listAllSongUseCase = container.resolve(ListAllSongUseCase);
  });  

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should list all songs', async () => {
    const songs = [
      {
        id: uuidv4(),
        name: 'Song 1',
        artist: 'Artist 1',
        imageurl: 'Image URL 1',
        notes: 'Notes 1',
        popularity: '5',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Song 2',
        artist: 'Artist 2',
        imageurl: 'Image URL 2',
        notes: 'Notes 2',
        popularity: '7',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Song 3',
        artist: 'Artist 3',
        imageurl: 'Image URL 3',
        notes: 'Notes 3',
        popularity: '9',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const mockedSong = { ...songs };

    songRepository.findAll.mockResolvedValueOnce(mockedSong);    

    const result = await listAllSongUseCase.execute();

    expect(songRepository.findAll).toHaveBeenCalled();
    expect(Object.values(result)).toEqual(songs);
  });
});