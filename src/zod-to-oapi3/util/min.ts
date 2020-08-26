import { ZodInternalCheck } from './zod.types';

export type OapiMinimum = {
  minimum: number;
  exclusiveMinimum?: boolean;
};

function getOapiMinimum(check: any): OapiMinimum | undefined {
  const minimumProperty = check.minimum;
  const isInclusive = !!check.inclusive;
  const minValue =
    typeof minimumProperty === 'number' ? minimumProperty : undefined;

  if (minValue === undefined) return undefined;
  const exclusiveMinimum = !isInclusive ? true : undefined;

  return {
    minimum: minValue,
    exclusiveMinimum,
  };
}

// noinspection DuplicatedCode
export function getOapiMinimumReduce(
  prev: OapiMinimum | undefined,
  check: ZodInternalCheck,
): OapiMinimum | undefined {
  const checkMin = getOapiMinimum(check);
  if (!checkMin) return prev;
  if (!prev) return checkMin;
  // we have prev and checkMin

  if (prev.minimum < checkMin.minimum) {
    return prev;
  } else if (prev.minimum > checkMin.minimum) {
    return checkMin;
  } else {
    // prev.minimum === checkMin.minimum

    /**
     * exclusive is only true when both are exclusive
     * otherwise it's inclusive
     */
    const exclusiveMinimumBool =
      prev.exclusiveMinimum && checkMin.exclusiveMinimum;
    const exclusiveMinimum = exclusiveMinimumBool ? true : undefined;

    return {
      // both are the same - take any
      minimum: prev.minimum,
      exclusiveMinimum,
    };
  }
}
