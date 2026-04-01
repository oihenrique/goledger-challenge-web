import { z } from 'zod';

import { tvShowReferenceSchema } from '@/shared/schemas';
import { assetTypes } from '@/shared/types';

export const seasonKeySchema = z.object({
  '@assetType': z.literal(assetTypes.seasons),
  number: z.number().int().positive(),
  tvShow: tvShowReferenceSchema,
});

export const createSeasonSchema = z.object({
  '@assetType': z.literal(assetTypes.seasons),
  number: z.number().int().positive(),
  tvShow: tvShowReferenceSchema,
  year: z.number().int().min(1900).max(2100),
});

export const updateSeasonSchema = createSeasonSchema;
