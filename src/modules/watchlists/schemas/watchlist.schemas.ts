import { z } from 'zod';

import { tvShowReferenceSchema } from '@/shared/schemas/api-reference.schemas';
import { assetTypes } from '@/shared/types/api-common.types';

export const watchlistKeySchema = z.object({
  '@assetType': z.literal(assetTypes.watchlist),
  title: z.string().min(1),
});

export const createWatchlistSchema = z.object({
  '@assetType': z.literal(assetTypes.watchlist),
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(500).optional(),
  tvShows: z.array(tvShowReferenceSchema).optional(),
});

export const updateWatchlistSchema = createWatchlistSchema;
