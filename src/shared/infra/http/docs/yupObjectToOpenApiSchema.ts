import { ObjectSchema } from 'yup';

interface OpenApiProperty {
  type: string;
  format?: string;
}

export interface OpenApiObjectSchema {
  type: 'object';
  properties: Record<string, OpenApiProperty>;
  required: string[];
}

const YUP_TYPE_TO_OPENAPI_TYPE: Record<string, string> = {
  string: 'string',
  number: 'number',
  boolean: 'boolean',
  date: 'string',
};

/**
 * Derives an OpenAPI object schema's shape (property types + required list)
 * straight from a Yup object schema, so the request-body docs can't drift
 * from the validation actually enforced at runtime. Numeric bounds are not
 * derivable from Yup's public API and must be merged in separately.
 */
export function yupObjectToOpenApiSchema(schema: ObjectSchema<Record<string, unknown>>): OpenApiObjectSchema {
  const properties: Record<string, OpenApiProperty> = {};
  const required: string[] = [];

  for (const [key, field] of Object.entries(schema.fields)) {
    const yupType = (field as unknown as { type: string }).type;
    const property: OpenApiProperty = { type: YUP_TYPE_TO_OPENAPI_TYPE[yupType] ?? 'string' };

    if (yupType === 'date') {
      property.format = 'date-time';
    }

    properties[key] = property;

    const isOptional = (field as unknown as { spec: { optional: boolean } }).spec.optional;
    if (!isOptional) {
      required.push(key);
    }
  }

  return { type: 'object', properties, required };
}
