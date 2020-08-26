import { ZodNull, ZodNumber, ZodUndefined, ZodUnion } from 'zod';
import { flattenUnionOptions } from './union';

describe('union', () => {
  it('flattenUnionOptions should work', () => {
    const subUnion = ZodUnion.create([ZodNumber.create(), ZodNull.create()]);
    const actual = flattenUnionOptions([
      ZodUnion.create([ZodUndefined.create(), subUnion]),
    ]);
    expect(actual.length).toBe(3);
    actual.find(type => type.is(ZodNumber));
    actual.find(type => type.is(ZodUndefined));
    actual.find(type => type.is(ZodNull));
  });
});
