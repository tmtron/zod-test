import * as z from 'zod';
import { handleNumber } from './numeric';

describe('numeric max', () => {
  it('should work for number with maximum', () => {
    const actual = handleNumber(z.number().max(10));
    expect(actual.type).toBe('number');
    expect(actual.maximum).toBe(10);
    expect(actual.exclusiveMaximum).toBeUndefined();
  });
  it('should work for number multiple with maximum checks', () => {
    const actual = handleNumber(
      z
        .number()
        .max(10)
        .max(50),
    );
    expect(actual.type).toBe('number');
    expect(actual.maximum).toBe(50);
    expect(actual.exclusiveMaximum).toBeUndefined();
  });

  it('should work for negative', () => {
    const actual = handleNumber(z.number().negative());
    expect(actual.type).toBe('number');
    expect(actual.maximum).toBe(0);
    expect(actual.exclusiveMaximum).toBeTruthy();
  });

  it('should work for nonpositive', () => {
    const actual = handleNumber(z.number().nonpositive());
    expect(actual.type).toBe('number');
    expect(actual.maximum).toBe(0);
    expect(actual.exclusiveMaximum).toBeUndefined();
  });
});
