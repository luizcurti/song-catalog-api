import * as Yup from 'yup';

import { yupObjectToOpenApiSchema } from '@shared/infra/http/docs/yupObjectToOpenApiSchema';

describe('yupObjectToOpenApiSchema', () => {
  it('derives property types and the required list from a Yup object schema', () => {
    const schema = Yup.object({
      title: Yup.string().required(),
      score: Yup.number().required(),
      active: Yup.boolean(),
      publishedAt: Yup.date(),
    });

    const result = yupObjectToOpenApiSchema(schema);

    expect(result).toEqual({
      type: 'object',
      properties: {
        title: { type: 'string' },
        score: { type: 'number' },
        active: { type: 'boolean' },
        publishedAt: { type: 'string', format: 'date-time' },
      },
      required: ['title', 'score'],
    });
  });

  it('falls back to "string" for an unrecognized Yup field type', () => {
    const schema = Yup.object({ anything: Yup.mixed() });

    const result = yupObjectToOpenApiSchema(schema);

    expect(result.properties.anything.type).toBe('string');
  });
});
