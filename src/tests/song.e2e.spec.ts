/**
 * Testes E2E - Song API
 *
 * Pré-requisitos: docker compose up (MySQL, Redis e app rodando em localhost:3005)
 * Base URL: http://localhost:3005/api/music
 */

import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:3005/api/music';

interface Song {
  id: string;
  name: string;
  artist: string;
  imageurl: string;
  notes: string;
  popularity: number;
  created_at: string;
  updated_at: string;
}

const validSongPayload = {
  name: 'E2E Test Song',
  artist: 'E2E Artist',
  imageurl: 'https://example.com/image.jpg',
  notes: 'E2E test notes',
  popularity: 8,
};

describe('Song API - E2E', () => {
  let createdSongId: string;

  // ─── POST /api/music ──────────────────────────────────────────────────────

  describe('POST /api/music (create song)', () => {
    it('should create a song and return 201 with the created object', async () => {
      const response = await axios.post<Song>(BASE_URL, validSongPayload);

      expect(response.status).toBe(201);
      expect(response.data).toMatchObject({
        name: validSongPayload.name,
        artist: validSongPayload.artist,
        imageurl: validSongPayload.imageurl,
        notes: validSongPayload.notes,
        popularity: validSongPayload.popularity,
      });
      expect(response.data.id).toBeDefined();
      expect(response.data.created_at).toBeDefined();
      expect(response.data.updated_at).toBeDefined();

      createdSongId = response.data.id;
    });

    it('should return 400 when name is missing', async () => {
      try {
        await axios.post(BASE_URL, {
          artist: 'Artist',
          imageurl: 'https://example.com/img.jpg',
          notes: 'Some notes',
          popularity: 5,
        });
        fail('Should have thrown an error');
      } catch (err) {
        const error = err as AxiosError<{ message: string; type: string }>;
        expect(error.response?.status).toBe(400);
        expect(error.response?.data.type).toBe('VALIDATIONS_FAILED');
      }
    });

    it('should return 400 when popularity is out of range (> 10)', async () => {
      try {
        await axios.post(BASE_URL, { ...validSongPayload, popularity: 11 });
        fail('Should have thrown an error');
      } catch (err) {
        const error = err as AxiosError<{ message: string; type: string }>;
        expect(error.response?.status).toBe(400);
        expect(error.response?.data.type).toBe('VALIDATIONS_FAILED');
      }
    });

    it('should return 400 when popularity is below 0', async () => {
      try {
        await axios.post(BASE_URL, { ...validSongPayload, popularity: -1 });
        fail('Should have thrown an error');
      } catch (err) {
        const error = err as AxiosError<{ message: string; type: string }>;
        expect(error.response?.status).toBe(400);
        expect(error.response?.data.type).toBe('VALIDATIONS_FAILED');
      }
    });
  });

  // ─── GET /api/music ───────────────────────────────────────────────────────

  describe('GET /api/music (list all songs)', () => {
    it('should return 200 with an array of songs', async () => {
      const response = await axios.get<Song[]>(BASE_URL);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThanOrEqual(1);
    });

    it('should include the previously created song in the list', async () => {
      const response = await axios.get<Song[]>(BASE_URL);

      const found = response.data.find((s) => s.id === createdSongId);
      expect(found).toBeDefined();
      expect(found?.name).toBe(validSongPayload.name);
    });
  });

  // ─── GET /api/music/:id ───────────────────────────────────────────────────

  describe('GET /api/music/:id (get song by ID)', () => {
    it('should return 200 with the correct song', async () => {
      const response = await axios.get<Song>(`${BASE_URL}/${createdSongId}`);

      expect(response.status).toBe(200);
      expect(response.data.id).toBe(createdSongId);
      expect(response.data.name).toBe(validSongPayload.name);
    });

    it('should return 404 when song does not exist', async () => {
      try {
        await axios.get(`${BASE_URL}/non-existent-id-000`);
        fail('Should have thrown an error');
      } catch (err) {
        const error = err as AxiosError<{ message: string; type: string }>;
        expect(error.response?.status).toBe(404);
        expect(error.response?.data.type).toBe('Not Found');
      }
    });
  });

  // ─── PUT /api/music/:id ───────────────────────────────────────────────────

  describe('PUT /api/music/:id (edit song)', () => {
    const updatedPayload = {
      name: 'Updated E2E Song',
      artist: 'Updated Artist',
      imageurl: 'https://example.com/updated-image.jpg',
      notes: 'Updated notes',
      popularity: 5,
    };

    it('should return 200 with the updated song', async () => {
      const response = await axios.put<Song>(
        `${BASE_URL}/${createdSongId}`,
        updatedPayload,
      );

      expect(response.status).toBe(200);
      expect(response.data.id).toBe(createdSongId);
      expect(response.data.name).toBe(updatedPayload.name);
      expect(response.data.artist).toBe(updatedPayload.artist);
      expect(response.data.popularity).toBe(updatedPayload.popularity);
    });

    it('should persist the update (GET confirms new data)', async () => {
      const response = await axios.get<Song>(`${BASE_URL}/${createdSongId}`);

      expect(response.data.name).toBe(updatedPayload.name);
      expect(response.data.artist).toBe(updatedPayload.artist);
    });

    it('should return 404 when trying to edit a non-existent song', async () => {
      try {
        await axios.put(`${BASE_URL}/non-existent-id-000`, updatedPayload);
        fail('Should have thrown an error');
      } catch (err) {
        const error = err as AxiosError<{ message: string; type: string }>;
        expect(error.response?.status).toBe(404);
        expect(error.response?.data.type).toBe('Not Found');
      }
    });
  });

  // ─── DELETE /api/music/:id ────────────────────────────────────────────────

  describe('DELETE /api/music/:id (delete song)', () => {
    it('should return 204 on successful deletion', async () => {
      const response = await axios.delete(`${BASE_URL}/${createdSongId}`);

      expect(response.status).toBe(204);
    });

    it('should return 404 when GET is called after deletion', async () => {
      try {
        await axios.get(`${BASE_URL}/${createdSongId}`);
        fail('Should have thrown an error');
      } catch (err) {
        const error = err as AxiosError<{ message: string; type: string }>;
        expect(error.response?.status).toBe(404);
      }
    });

    it('should return 404 when trying to delete an already deleted song', async () => {
      try {
        await axios.delete(`${BASE_URL}/${createdSongId}`);
        fail('Should have thrown an error');
      } catch (err) {
        const error = err as AxiosError<{ message: string; type: string }>;
        expect(error.response?.status).toBe(404);
        expect(error.response?.data.type).toBe('Not Found');
      }
    });
  });

  // ─── 404 para rota inexistente ────────────────────────────────────────────

  describe('Not Found middleware', () => {
    it('should return 404 for unknown routes', async () => {
      try {
        await axios.get('http://localhost:3005/api/nonexistent');
        fail('Should have thrown an error');
      } catch (err) {
        const error = err as AxiosError;
        expect(error.response?.status).toBe(404);
      }
    });
  });
});
