import * as z from 'zod';
import { handleNumber } from './numeric';

describe('numeric min', () => {
  it('should work for number with minimum', () => {
    const actual = handleNumber(z.number().min(10));
    expect(actual.type).toBe('number');
    expect(actual.minimum).toBe(10);
    expect(actual.exclusiveMinimum).toBeUndefined();
  });
  it('should work for number multiple with minimum checks', () => {
    const actual = handleNumber(
      z
        .number()
        .min(10)
        .min(50),
    );
    expect(actual.type).toBe('number');
    expect(actual.minimum).toBe(10);
    expect(actual.exclusiveMinimum).toBeUndefined();
  });

  it('should work for positive', () => {
    const actual = handleNumber(z.number().positive());
    expect(actual.type).toBe('number');
    expect(actual.minimum).toBe(0);
    expect(actual.exclusiveMinimum).toBeTruthy();
  });

  it('should work for nonnegative', () => {
    const actual = handleNumber(z.number().nonnegative());
    expect(actual.type).toBe('number');
    expect(actual.minimum).toBe(0);
    expect(actual.exclusiveMinimum).toBeUndefined();
  });
});
