import { AppDataSource } from '@shared/infra/database/dataSource';
import { TypeOrmSongRepository } from '@modules/song/infra/typeorm/repositories/typeOrmSongRepository';

describe('TypeOrmSongRepository (integration)', () => {
  let songRepository: TypeOrmSongRepository;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    songRepository = new TypeOrmSongRepository();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  const buildSongInput = () => ({
    name: 'Integration Test Song',
    artist: 'Integration Test Artist',
    imageurl: 'https://example.com/song.jpg',
    notes: 'Some notes',
    popularity: 6,
  });

  it('creates a song and persists it with generated id and timestamps', async () => {
    const song = await songRepository.create(buildSongInput());

    expect(song.id).toEqual(expect.any(String));
    expect(song.created_at).toBeInstanceOf(Date);
    expect(song.updated_at).toBeInstanceOf(Date);

    await songRepository.remove(song);
  });

  it('finds a song by id', async () => {
    const created = await songRepository.create(buildSongInput());

    const found = await songRepository.findByID(created.id);

    expect(found).toMatchObject({ id: created.id, name: created.name });

    await songRepository.remove(created);
  });

  it('returns null when the song does not exist', async () => {
    const found = await songRepository.findByID('00000000-0000-0000-0000-000000000000');

    expect(found).toBeNull();
  });

  it('lists all songs including a newly created one', async () => {
    const created = await songRepository.create(buildSongInput());

    const all = await songRepository.findAll();

    expect(all.some((song) => song.id === created.id)).toBe(true);

    await songRepository.remove(created);
  });

  it('updates an existing song', async () => {
    const created = await songRepository.create(buildSongInput());

    const updated = await songRepository.update({ ...created, name: 'Updated Name' });

    expect(updated.name).toBe('Updated Name');

    const found = await songRepository.findByID(created.id);
    expect(found?.name).toBe('Updated Name');

    await songRepository.remove(created);
  });

  it('removes a song', async () => {
    const created = await songRepository.create(buildSongInput());
    const { id } = created;

    // TypeORM's repository.remove() mutates the entity, clearing its primary key —
    // the id must be captured beforehand.
    await songRepository.remove(created);

    const found = await songRepository.findByID(id);
    expect(found).toBeNull();
  });

  describe('findPaginated', () => {
    const createdIds: string[] = [];

    beforeAll(async () => {
      const seeds = [
        { name: 'Bohemian Rhapsody', artist: 'Queen', popularity: 10 },
        { name: 'Somebody to Love', artist: 'Queen', popularity: 8 },
        { name: 'Imagine', artist: 'John Lennon', popularity: 6 },
      ];

      for (const seed of seeds) {
        const song = await songRepository.create({ ...buildSongInput(), ...seed });
        createdIds.push(song.id);
      }
    });

    afterAll(async () => {
      for (const id of createdIds) {
        const song = await songRepository.findByID(id);
        if (song) await songRepository.remove(song);
      }
    });

    it('paginates results and reports the total across all pages', async () => {
      const firstPage = await songRepository.findPaginated({ page: 1, limit: 2, artist: 'Queen' });

      expect(firstPage.data).toHaveLength(2);
      expect(firstPage.total).toBe(2);
    });

    it('filters by a case-insensitive artist substring', async () => {
      const { data, total } = await songRepository.findPaginated({ page: 1, limit: 10, artist: 'queen' });

      expect(total).toBe(2);
      expect(data.every((song) => song.artist === 'Queen')).toBe(true);
    });

    it('filters by a name substring', async () => {
      const { data, total } = await songRepository.findPaginated({ page: 1, limit: 10, name: 'Imagine' });

      expect(total).toBe(1);
      expect(data[0].name).toBe('Imagine');
    });

    it('filters by a popularity range', async () => {
      const { data, total } = await songRepository.findPaginated({
        page: 1,
        limit: 10,
        popularityMin: 9,
        popularityMax: 10,
      });

      expect(total).toBe(1);
      expect(data[0].name).toBe('Bohemian Rhapsody');
    });
  });
});
