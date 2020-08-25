import * as z from 'zod';

export const dogSchema = z.object({
  name: z.string(),
  neutered: z.boolean(),
});

export type Dog = z.infer<typeof dogSchema>;
