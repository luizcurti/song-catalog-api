import request from 'supertest';

import { App } from '@shared/infra/app';

describe('Song API (e2e)', () => {
  const app = new App();
  const apiKey = process.env.X_API_KEY as string;

  const validSongPayload = {
    name: 'E2E Test Song',
    artist: 'E2E Artist',
    imageurl: 'https://example.com/image.jpg',
    notes: 'E2E test notes',
    popularity: 8,
  };

  let createdSongId: string;

  beforeAll(async () => {
    await app.init();
  });

  afterAll(async () => {
    await app.shutdown();
  });

  describe('POST /api/music (create song)', () => {
    it('creates a song and returns 201 with the created object', async () => {
      const response = await request(app.server).post('/api/music').set('x-api-key', apiKey).send(validSongPayload);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(validSongPayload);
      expect(response.body.id).toBeDefined();
      expect(response.body.created_at).toBeDefined();
      expect(response.body.updated_at).toBeDefined();

      createdSongId = response.body.id;
    });

    it('returns 401 without an API key', async () => {
      const response = await request(app.server).post('/api/music').send(validSongPayload);

      expect(response.status).toBe(401);
    });

    it('returns 400 when name is missing', async () => {
      const { name, ...payloadWithoutName } = validSongPayload;
      void name;

      const response = await request(app.server).post('/api/music').set('x-api-key', apiKey).send(payloadWithoutName);

      expect(response.status).toBe(400);
      expect(response.body.type).toBe('VALIDATIONS_FAILED');
    });

    it('returns 400 when popularity is out of range', async () => {
      const response = await request(app.server)
        .post('/api/music')
        .set('x-api-key', apiKey)
        .send({ ...validSongPayload, popularity: 11 });

      expect(response.status).toBe(400);
      expect(response.body.type).toBe('VALIDATIONS_FAILED');
    });
  });

  describe('GET /api/music (list all songs)', () => {
    it('returns 200 with a paginated page that includes the created song', async () => {
      const response = await request(app.server).get('/api/music');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.meta).toMatchObject({ page: 1, limit: 20 });
      expect(response.body.data.some((song: { id: string }) => song.id === createdSongId)).toBe(true);
    });

    it('filters by artist', async () => {
      const response = await request(app.server).get('/api/music').query({ artist: validSongPayload.artist });

      expect(response.status).toBe(200);
      expect(response.body.data.every((song: { artist: string }) => song.artist === validSongPayload.artist)).toBe(
        true,
      );
    });

    it('respects the limit query param', async () => {
      const response = await request(app.server).get('/api/music').query({ limit: 1 });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeLessThanOrEqual(1);
      expect(response.body.meta.limit).toBe(1);
    });

    it('returns 400 for an out-of-range limit', async () => {
      const response = await request(app.server).get('/api/music').query({ limit: 1000 });

      expect(response.status).toBe(400);
      expect(response.body.type).toBe('VALIDATIONS_FAILED');
    });
  });

  describe('GET /api/music/:id (get song by id)', () => {
    it('returns 200 with the correct song', async () => {
      const response = await request(app.server).get(`/api/music/${createdSongId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createdSongId);
    });

    it('returns 404 when the song does not exist', async () => {
      const response = await request(app.server).get('/api/music/00000000-0000-0000-0000-000000000000');

      expect(response.status).toBe(404);
      expect(response.body.type).toBe('Not Found');
    });
  });

  describe('PUT /api/music/:id (edit song)', () => {
    const updatedPayload = {
      name: 'Updated E2E Song',
      artist: 'Updated Artist',
      imageurl: 'https://example.com/updated-image.jpg',
      notes: 'Updated notes',
      popularity: 5,
    };

    it('returns 200 with the updated song', async () => {
      const response = await request(app.server)
        .put(`/api/music/${createdSongId}`)
        .set('x-api-key', apiKey)
        .send(updatedPayload);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(updatedPayload);
    });

    it('persists the update', async () => {
      const response = await request(app.server).get(`/api/music/${createdSongId}`);

      expect(response.body).toMatchObject(updatedPayload);
    });

    it('returns 404 when editing a non-existent song', async () => {
      const response = await request(app.server)
        .put('/api/music/00000000-0000-0000-0000-000000000000')
        .set('x-api-key', apiKey)
        .send(updatedPayload);

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/music/:id (delete song)', () => {
    it('returns 204 on successful deletion', async () => {
      const response = await request(app.server).delete(`/api/music/${createdSongId}`).set('x-api-key', apiKey);

      expect(response.status).toBe(204);
    });

    it('returns 404 when the song is already deleted', async () => {
      const response = await request(app.server).delete(`/api/music/${createdSongId}`).set('x-api-key', apiKey);

      expect(response.status).toBe(404);
      expect(response.body.type).toBe('Not Found');
    });
  });

  describe('unknown routes', () => {
    it('returns 404', async () => {
      const response = await request(app.server).get('/api/does-not-exist');

      expect(response.status).toBe(404);
    });
  });
});
