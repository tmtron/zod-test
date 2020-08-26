import { ZodDef, ZodTypeAny, ZodTypes, ZodUnion } from 'zod';
import { ZtoContext } from '../util/zod.types';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import * as z from 'zod/lib/src/types/base';
import { ZodTypeDef } from 'zod/lib/src/types/base';

/**
 * this function returns a flattened union option
 *
 * when we optional and nullable for a zod type
 *
 * e.g. for
 *   z.number().nullable().optional()
 * zod creates nested union types which are difficult to handle:
 * - UNION: UNION & UNDEFINED
 *            |
 *            `- UNION: NUMBER & NULL
 * this function will return a single union:
 * - UNION: NUMBER & NULL & UNDEFINED
 */
export function flattenUnionOptions(zodOptions: ZodTypeAny[]): ZodTypeAny[] {
  const result = new Array<ZodTypeAny>();

  zodOptions.forEach(zodOption => {
    const def: ZodDef = zodOption._def;
    if (def.t === ZodTypes.union) {
      const subUnion = zodOption as ZodUnion<any>;
      const subDef: ZodDef = subUnion._def;
      const subOptions = flattenUnionOptions(subDef.options);
      result.push(...subOptions);
    } else {
      result.push(zodOption);
    }
  });

  return result;
}

function filterZodOptionsByType(
  zodOptions: ZodTypeAny[],
  typeToExclude: ZodTypes,
) {
  return zodOptions.filter(
    option => (option._def as ZodDef).t !== typeToExclude,
  );
}

export function handleUnion(
  ctx: ZtoContext,
  zodUnion: ZodUnion<any>,
): SchemaObject | undefined {
  const def: ZodDef = zodUnion._def;

  const flattenedOptions = flattenUnionOptions(def.options);

  /**
   * remove undefined type from union
   * this is handled by isOptional
   */
  const optionsWithoutUndefined = filterZodOptionsByType(
    flattenedOptions,
    z.ZodTypes.undefined,
  );
  /**
   * remove null type from union
   * this is handled by nullable
   */
  const options = filterZodOptionsByType(
    optionsWithoutUndefined,
    z.ZodTypes.null,
  );
  const nullableBool = options.length < optionsWithoutUndefined.length;
  const nullable = nullableBool ? true : undefined;

  if (options.length === 0) {
    throw new Error(
      'union must have at least one type (except undefined/nullable)',
    );
  } else if (options.length === 1) {
    const singleUnionType = options[0];
    const result = ctx.getOpenApiSchemaType(singleUnionType);
    if (!result) {
      return ctx.handleUnsupported(
        `unsupported type '${(singleUnionType._def as ZodTypeDef).t}' in union`,
      );
    }
    return { ...result, nullable };
  } else {
    return ctx.handleUnsupported(
      'FIXME: union with multiple types is not implemented',
    );
  }
}
