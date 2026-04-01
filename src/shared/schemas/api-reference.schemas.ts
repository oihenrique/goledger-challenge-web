import { z } from 'zod';

import { assetTypes } from '@/shared/types/api-common.types';

export const tvShowReferenceSchema = z.object({
  '@assetType': z.literal(assetTypes.tvShows),
  '@key': z.string().min(1).max(255),
});

export const seasonReferenceSchema = z.object({
  '@assetType': z.literal(assetTypes.seasons),
  '@key': z.string().min(1).max(255),
});

export const watchlistReferenceSchema = z.object({
  '@assetType': z.literal(assetTypes.watchlist),
  '@key': z.string().min(1).max(255),
});

export const isoDateTimeSchema = z.iso.datetime({ offset: true });
