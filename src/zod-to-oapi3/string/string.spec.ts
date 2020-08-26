import * as z from 'zod';
import { handleString } from './string';

describe('strings', () => {
  it('should work for string', () => {
    const actual = handleString(z.string());
    expect(actual.type).toBe('string');
  });

  it('should work for string with min/max', () => {
    const actual = handleString(
      z
        .string()
        .min(4)
        .min(2)
        .max(12)
        .max(7),
    );
    expect(actual.type).toBe('string');
    expect(actual.minimum).toBe(2);
    expect(actual.exclusiveMinimum).toBeFalsy();
    expect(actual.maximum).toBe(12);
    expect(actual.exclusiveMaximum).toBeFalsy();
  });

  it('should work for string with length', () => {
    const actual = handleString(z.string().length(10));
    expect(actual.type).toBe('string');
    expect(actual.minimum).toBe(10);
    expect(actual.exclusiveMinimum).toBeFalsy();
    expect(actual.maximum).toBe(10);
    expect(actual.exclusiveMaximum).toBeFalsy();
  });
});
