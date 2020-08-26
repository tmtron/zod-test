import { ZodDef, ZodObject, ZodType, ZodTypes } from 'zod';
import { ZtoContext } from '../util/zod.types';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ZodRawShape, ZodTypeDef } from 'zod/lib/src/types/base';

/**
 * note: this function in zod codegen.ts is not public
 * thus we had to copy it
 */
export const isOptional = (schema: ZodType<any, any>): boolean => {
  const def: ZodDef = schema._def;
  if (def.t === ZodTypes.undefined) return true;
  else if (def.t === ZodTypes.intersection) {
    return isOptional(def.right) && isOptional(def.left);
  } else if (def.t === ZodTypes.union) {
    return def.options.map(isOptional).some(x => x === true);
  }
  return false;
};

export function handleObject(
  context: ZtoContext,
  zodType: ZodObject<any>,
): SchemaObject {
  const result: SchemaObject = {
    type: 'object',
    properties: {},
    required: [],
  };
  const shape = zodType.shape as ZodRawShape;
  Object.entries(shape).map(([propertyName, zodType]) => {
    const schemaObject = context.getOpenApiSchemaType(zodType);
    if (schemaObject) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result.properties![propertyName] = schemaObject;
      const isRequired = !isOptional(zodType);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (isRequired) result.required!.push(propertyName);
    } else {
      return context.handleUnsupported(
        `unsupported type '${
          (zodType._def as ZodTypeDef).t
        }' of object property ${propertyName}`,
      );
    }
  });
  return result;
}
