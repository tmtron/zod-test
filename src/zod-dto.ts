import * as z from 'zod';

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
});

export type Dog = z.infer<typeof dogSchema>;
