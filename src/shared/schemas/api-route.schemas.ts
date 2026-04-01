import { z } from 'zod';

export const searchRouteSchema = z.object({
  limit: z.number().int().positive().optional(),
  bookmark: z.string().optional(),
  resolve: z.boolean().optional(),
});

export function createReadRouteSchema<TKey extends z.ZodType>(keySchema: TKey) {
  return z.object({
    key: keySchema,
    resolve: z.boolean().optional(),
  });
}

export function createHistoryRouteSchema<TKey extends z.ZodType>(
  keySchema: TKey,
) {
  return z.object({
    key: keySchema,
  });
}
