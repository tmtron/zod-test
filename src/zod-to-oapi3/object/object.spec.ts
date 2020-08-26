/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as z from 'zod';
import { zodToOapi3 } from '../zod-to-oapi3';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

function getPropAsSchemaObj(schemaObject: SchemaObject, propertyName: string) {
  if (!schemaObject.properties) {
    const msg = `schemaObject has no properties`;
    console.error(msg, schemaObject);
    throw new Error(msg);
  }
  return schemaObject.properties[propertyName] as SchemaObject;
}

describe('object', () => {
  it('should work for an object with 2 simple members of different type', () => {
    const actual = zodToOapi3(
      z.object({
        num: z.number().min(10),
        text: z.string(),
      }),
    );
    expect(actual.type).toBe('object');
    const oapiNum = getPropAsSchemaObj(actual, 'num');
    expect(oapiNum.type).toBe('number');
    expect(oapiNum.minimum).toBe(10);
    expect(oapiNum.exclusiveMinimum).toBeFalsy();

    const oapiText = getPropAsSchemaObj(actual, 'text');
    expect(oapiText.type).toBe('string');
  });

  it('should work for optional and required properties', () => {
    const actual = zodToOapi3(
      z.object({
        num: z.number().optional(),
        text: z.string(),
        xx: z.bigint().optional(),
      }),
    );
    expect(actual.required).toStrictEqual(['text']);
  });

  it('should work for optional and nullable properties', () => {
    const testSchema = z.object({
      num: z.number(),
      numOpt: z.number().optional(),
      numNullable: z.number().nullable(),
      numOptAndNullable: z
        .number()
        .nullable()
        .optional(),
    });

    type schemaType = z.infer<typeof testSchema>;

    const actual = zodToOapi3(testSchema);

    function _expectNullable(
      propertyKey: keyof schemaType,
      expected: 'true' | 'undefined',
    ) {
      const property = getPropAsSchemaObj(actual, propertyKey);
      switch (expected) {
        case 'true':
          expect(property.nullable).toBe(true);
          break;
        case 'undefined':
          expect(property.nullable).toBeUndefined();
          break;
      }
    }

    function expectNullable(propertyKey: keyof schemaType) {
      _expectNullable(propertyKey, 'true');
    }
    function expectNotNullable(propertyKey: keyof schemaType) {
      _expectNullable(propertyKey, 'undefined');
    }

    expectNotNullable('num');
    expectNotNullable('numOpt');
    expectNullable('numNullable');
    expectNullable('numOptAndNullable');

    expect(actual.required).toStrictEqual(['num', 'numNullable']);
  });
});
