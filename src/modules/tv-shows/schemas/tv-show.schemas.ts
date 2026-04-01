import { z } from 'zod';

import { assetTypes } from '@/shared/types/api-common.types';

export const tvShowKeySchema = z.object({
  '@assetType': z.literal(assetTypes.tvShows),
  title: z.string().min(1).max(255),
});

export const createTvShowSchema = z.object({
  '@assetType': z.literal(assetTypes.tvShows),
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(500),
  recommendedAge: z.number().finite().min(0).positive(),
});

export const updateTvShowSchema = createTvShowSchema;
