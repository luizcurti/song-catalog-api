import { POPULARITY_MAX, POPULARITY_MIN, songSchema } from '@modules/song/useCases/songSchema';
import { openapiDocument } from '@shared/infra/http/docs/openapiDocument';

describe('openapiDocument', () => {
  it('documents exactly the fields required by the song validation schema', () => {
    const songInput = openapiDocument.components.schemas.SongInput;

    expect(Object.keys(songInput.properties).sort()).toEqual(Object.keys(songSchema.fields).sort());
    expect(songInput.required.sort()).toEqual(Object.keys(songSchema.fields).sort());
  });

  it('keeps the documented popularity bounds in sync with the validation constants', () => {
    const popularity = openapiDocument.components.schemas.SongInput.properties.popularity as unknown as {
      minimum: number;
      maximum: number;
    };

    expect(popularity.minimum).toBe(POPULARITY_MIN);
    expect(popularity.maximum).toBe(POPULARITY_MAX);
  });

  it('declares api key security on every mutating song endpoint', () => {
    expect(openapiDocument.paths['/api/music'].post.security).toEqual([{ apiKeyAuth: [] }]);
    expect(openapiDocument.paths['/api/music/{id}'].put.security).toEqual([{ apiKeyAuth: [] }]);
    expect(openapiDocument.paths['/api/music/{id}'].delete.security).toEqual([{ apiKeyAuth: [] }]);
  });
});
