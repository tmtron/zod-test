import {
  ZodDef,
  ZodNumber,
  ZodObject,
  ZodString,
  ZodType,
  ZodTypes,
  ZodUnion,
} from 'zod';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { handleNumber } from './numeric/numeric';
import { handleObject } from './object/object';
import { handleUnion } from './union/union';
import { HandleUnsupportedFct, ZtoContext } from './util/zod.types';
import { handleString } from './string/string';

const DEVELOPMENT = true; // FIXME

const DEFAULT_HANDLE_UNSUPPORTED_FCT: HandleUnsupportedFct = DEVELOPMENT
  ? msg => console.warn(msg)
  : msg => {
      throw new Error(msg);
    };

function getOpenApiSchemaType(
  ctx: ZtoContext,
  zodType: ZodType<any>,
): SchemaObject | undefined {
  const zodTypeDef = zodType._def.t;

  // FIXME: implement all then remove empty
  const EMPTY = undefined;

  switch (zodTypeDef) {
    case ZodTypes.string:
      return handleString(zodType as ZodString);
    case ZodTypes.number:
      return handleNumber(zodType as ZodNumber);
    case ZodTypes.bigint:
      return EMPTY;
    case ZodTypes.boolean:
      return { type: 'boolean' };
    case ZodTypes.date:
      return EMPTY;
    case ZodTypes.undefined:
      throw new Error(`'undefined' is not a valid Open API type: use 'zod.optional()' instead.
      see https://github.com/vriad/zod#optional-types`);
    case ZodTypes.null:
      throw new Error(`'null' is not a valid Open API type: use 'zod.nullable()' instead.
      see https://github.com/vriad/zod#nullable-types`);
    case ZodTypes.array:
      return EMPTY;
    case ZodTypes.object:
      return handleObject(ctx, zodType as ZodObject<any>);
    case ZodTypes.union:
      return handleUnion(ctx, zodType as ZodUnion<any>);
    case ZodTypes.intersection:
      return EMPTY;
    case ZodTypes.tuple:
      return EMPTY;
    case ZodTypes.record:
      return EMPTY;
    case ZodTypes.function:
      return EMPTY;
    case ZodTypes.lazy:
      return EMPTY;
    case ZodTypes.literal:
      return EMPTY;
    case ZodTypes.enum:
      return EMPTY;
    case ZodTypes.promise:
      return EMPTY;
    case ZodTypes.any:
      return EMPTY;
    case ZodTypes.unknown:
      return EMPTY;
    case ZodTypes.void:
      return EMPTY;
  }
}

export function zodToOapi3OrUndef(
  zodType: ZodType<any>,
  handleUnsupported = DEFAULT_HANDLE_UNSUPPORTED_FCT,
): SchemaObject | undefined {
  const ctx = new ZtoContext(handleUnsupported, getOpenApiSchemaType);
  const result = getOpenApiSchemaType(ctx, zodType);
  // FIXME set common properties: name, description, etc.
  return result;
}

export function zodToOapi3(
  zodType: ZodType<any>,
  handleUnsupported = DEFAULT_HANDLE_UNSUPPORTED_FCT,
): SchemaObject {
  const result = zodToOapi3OrUndef(zodType, handleUnsupported);
  if (!result) {
    throw new Error('unknown zodType: ' + (zodType._def as ZodDef).t);
  }
  return result;
}
