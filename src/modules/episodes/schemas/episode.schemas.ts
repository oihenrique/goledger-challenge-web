import { z } from 'zod';

import {
  isoDateTimeSchema,
  seasonReferenceSchema,
} from '@/shared/schemas/api-reference.schemas';
import { assetTypes } from '@/shared/types/api-common.types';

export const episodeKeySchema = z.object({
  '@assetType': z.literal(assetTypes.episodes),
  season: seasonReferenceSchema,
  episodeNumber: z.number().int().positive(),
});

export const createEpisodeSchema = z.object({
  '@assetType': z.literal(assetTypes.episodes),
  season: seasonReferenceSchema,
  episodeNumber: z.number().int().positive(),
  title: z.string().min(1).max(255),
  releaseDate: isoDateTimeSchema,
  description: z.string().min(1).max(500),
  rating: z.number().finite().min(0).max(10).optional(),
});

export const updateEpisodeSchema = createEpisodeSchema;
