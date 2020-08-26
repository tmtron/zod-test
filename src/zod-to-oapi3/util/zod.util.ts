import { ZodTypeDef } from 'zod';
import { ZodInternalCheck } from './zod.types';

/**
 * reduce over the checks of zodTypeDef
 */
export function reduceChecks<U>(
  zodTypeDef: ZodTypeDef,
  initialValue: U,
  reducer: (previousValue: U, currentValue: ZodInternalCheck) => U,
): U {
  if (!zodTypeDef.checks) return initialValue;
  return zodTypeDef.checks.reduce(reducer, initialValue);
}
