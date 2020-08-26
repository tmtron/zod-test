import { ZodInternalCheck } from './zod.types';

export type OapiMaximum = {
  maximum: number;
  exclusiveMaximum?: boolean;
};

function getOapiMaximum(check: any): OapiMaximum | undefined {
  const maximumProperty = check.maximum;
  const isInclusive = !!check.inclusive;
  const maxValue =
    typeof maximumProperty === 'number' ? maximumProperty : undefined;

  if (maxValue === undefined) return undefined;

  const exclusiveMaximum = !isInclusive ? true : undefined;

  return {
    maximum: maxValue,
    exclusiveMaximum,
  };
}

// noinspection DuplicatedCode
export function getOapiMaximumReduce(
  prev: OapiMaximum | undefined,
  check: ZodInternalCheck,
): OapiMaximum | undefined {
  const checkMax = getOapiMaximum(check);
  if (!checkMax) return prev;
  if (!prev) return checkMax;
  // we have prev and checkMax

  if (prev.maximum > checkMax.maximum) {
    return prev;
  } else if (prev.maximum < checkMax.maximum) {
    return checkMax;
  } else {
    // prev.maximum === checkMax.maximum

    /**
     * exclusive is only true when both are exclusive
     * otherwise it's inclusive
     */
    const exclusiveMaximumBool =
      prev.exclusiveMaximum && checkMax.exclusiveMaximum;
    const exclusiveMaximum = exclusiveMaximumBool ? true : undefined;

    return {
      // both are the same - take any
      maximum: prev.maximum,
      exclusiveMaximum,
    };
  }
}
