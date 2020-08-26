import * as z from 'zod';
import { TypeOf } from 'zod';
import { oapiSchema } from './zod-to-oapi3/zod-nestjs-oapi';

export const nestedSchema = z.object({
  nestedName: z.string(),
});

export const dogSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(12),
  age: z.number(),
  ageOpt: z.number().optional(),
  ageInt: z
    .number()
    .int()
    .min(0)
    .max(100),
  nested: nestedSchema.optional(),
});

export type Dog = TypeOf<typeof dogSchema>;

const TestDog: Dog = {
  age: 12,
  ageInt: 11,
  name: 'ab',
  nested: {
    nestedName: 'nested name',
  },
};

export const DOG_OAPI_SCHEMA = oapiSchema(dogSchema, {
  description: `# dog info object
  a dog has:
  * a name
  * an age, ..`,
  properties: {
    name: { description: 'doggos name' },
    ageInt: {},
    age: {},
    ageOpt: {},
    nested: {
      description: 'a nested property',
    },
  },
});
