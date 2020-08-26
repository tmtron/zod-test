import { ZodObject } from 'zod/lib/src/types/object';
import { ApiPropertyOptions } from '@nestjs/swagger';
import { TypeOf } from 'zod';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { zodToOapi3OrUndef } from './zod-to-oapi3';
import { merge } from 'lodash';
import { SchemaObjectMetadata } from '@nestjs/swagger/dist/interfaces/schema-object-metadata.interface';

export function oapiSchema<T extends ZodObject<any>>(
  zodObject: T,
  extraInfo: Omit<SchemaObjectMetadata, 'properties'> & {
    properties: Record<keyof TypeOf<T>, ApiPropertyOptions>;
  },
): SchemaObject | undefined {
  const zodSchema = zodToOapi3OrUndef(zodObject);

  merge(zodSchema, extraInfo);

  return zodSchema;
}
