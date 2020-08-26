import { ZodString } from 'zod';
import { reduceChecks } from '../util/zod.util';
import { getOapiMinimumReduce } from '../util/min';
import { getOapiMaximumReduce } from '../util/max';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function handleString(zodString: ZodString): SchemaObject {
  const oapiMinimum = reduceChecks(
    zodString._def,
    undefined,
    getOapiMinimumReduce,
  );

  const oapiMaximum = reduceChecks(
    zodString._def,
    undefined,
    getOapiMaximumReduce,
  );

  return { type: 'string', ...oapiMinimum, ...oapiMaximum };
}
