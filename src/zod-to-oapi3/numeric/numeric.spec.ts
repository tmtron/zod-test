import * as z from 'zod';
import { handleNumber } from './numeric';

describe('numbers', () => {
  it('should work for number', () => {
    const actual = handleNumber(z.number());
    expect(actual.type).toBe('number');
  });

  it('should work for integer', () => {
    const actual = handleNumber(z.number().int());
    expect(actual.type).toBe('integer');
  });

  it('should work for integer with min/max', () => {
    const actual = handleNumber(
      z
        .number()
        .int()
        .min(-1)
        .min(-3)
        .max(12)
        .max(7),
    );
    expect(actual.type).toBe('integer');
    expect(actual.minimum).toBe(-3);
    expect(actual.exclusiveMinimum).toBeFalsy();
    expect(actual.maximum).toBe(12);
    expect(actual.exclusiveMaximum).toBeFalsy();
  });
});
