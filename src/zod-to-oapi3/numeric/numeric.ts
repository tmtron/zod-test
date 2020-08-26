import { ZodNumber } from 'zod';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { getOapiMinimumReduce } from '../util/min';
import { getOapiMaximumReduce } from '../util/max';
import { reduceChecks } from '../util/zod.util';
import { ZodInternalCheck } from '../util/zod.types';

function checkIsInteger(check: ZodInternalCheck) {
  return check.expected === 'integer';
}

export function handleNumber(zodNumber: ZodNumber): SchemaObject {
  const oapiMinimum = reduceChecks(
    zodNumber._def,
    undefined,
    getOapiMinimumReduce,
  );

  const oapiMaximum = reduceChecks(
    zodNumber._def,
    undefined,
    getOapiMaximumReduce,
  );

  const isInteger = reduceChecks(
    zodNumber._def,
    false,
    (prev, current) => prev || checkIsInteger(current),
  );
  const type = isInteger ? 'integer' : 'number';

  return { type, ...oapiMinimum, ...oapiMaximum };
}
