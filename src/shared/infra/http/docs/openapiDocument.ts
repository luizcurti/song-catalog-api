import { songSchema, POPULARITY_MAX, POPULARITY_MIN } from '@modules/song/useCases/songSchema';

import { yupObjectToOpenApiSchema } from './yupObjectToOpenApiSchema';

const songInputSchema = yupObjectToOpenApiSchema(songSchema);
songInputSchema.properties.popularity = {
  ...songInputSchema.properties.popularity,
  minimum: POPULARITY_MIN,
  maximum: POPULARITY_MAX,
} as never;

const songSchemaExample = {
  name: 'Bohemian Rhapsody',
  artist: 'Queen',
  imageurl: 'https://example.com/image.jpg',
  notes: 'A classic rock opera ballad.',
  popularity: 10,
};

export const openapiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Music Artist API',
    version: '1.0.0',
    description: 'REST API for managing a song catalog.',
  },
  servers: [{ url: '/' }],
  components: {
    securitySchemes: {
      apiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
      },
    },
    schemas: {
      SongInput: songInputSchema,
      Song: {
        allOf: [
          { type: 'object', properties: { id: { type: 'string', format: 'uuid' } } },
          songInputSchema,
          {
            type: 'object',
            properties: {
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
            },
          },
        ],
      },
      PaginatedSongs: {
        type: 'object',
        properties: {
          data: { type: 'array', items: { $ref: '#/components/schemas/Song' } },
          meta: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
              limit: { type: 'integer' },
              total: { type: 'integer' },
              totalPages: { type: 'integer' },
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          type: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Liveness/readiness check',
        responses: {
          '200': { description: 'Database and Redis are both reachable' },
          '503': { description: 'Database or Redis is unreachable' },
        },
      },
    },
    '/api/music': {
      get: {
        summary: 'List songs',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
          { name: 'name', in: 'query', schema: { type: 'string' }, description: 'Case-insensitive substring match' },
          {
            name: 'artist',
            in: 'query',
            schema: { type: 'string' },
            description: 'Case-insensitive substring match',
          },
          {
            name: 'popularityMin',
            in: 'query',
            schema: { type: 'number', minimum: POPULARITY_MIN, maximum: POPULARITY_MAX },
          },
          {
            name: 'popularityMax',
            in: 'query',
            schema: { type: 'number', minimum: POPULARITY_MIN, maximum: POPULARITY_MAX },
          },
        ],
        responses: {
          '200': {
            description: 'A page of songs',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedSongs' } } },
          },
          '400': {
            description: 'Invalid query parameters',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
      post: {
        summary: 'Create a song',
        security: [{ apiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/SongInput' }, example: songSchemaExample },
          },
        },
        responses: {
          '201': {
            description: 'The created song',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Song' } } },
          },
          '400': {
            description: 'Validation failed',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          '401': { description: 'Missing or invalid API key' },
        },
      },
    },
    '/api/music/{id}': {
      get: {
        summary: 'Get a song by id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '200': {
            description: 'The requested song',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Song' } } },
          },
          '404': { description: 'Song not found' },
        },
      },
      put: {
        summary: 'Update a song',
        security: [{ apiKeyAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/SongInput' } } },
        },
        responses: {
          '200': {
            description: 'The updated song',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Song' } } },
          },
          '400': { description: 'Validation failed' },
          '401': { description: 'Missing or invalid API key' },
          '404': { description: 'Song not found' },
        },
      },
      delete: {
        summary: 'Delete a song',
        security: [{ apiKeyAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '204': { description: 'Deleted' },
          '401': { description: 'Missing or invalid API key' },
          '404': { description: 'Song not found' },
        },
      },
    },
  },
};
