import { createDomainApiHandler } from '@/lib/api/create-domain-api-handler';
import {
  createSeasonSchema,
  seasonKeySchema,
  updateSeasonSchema,
} from '@/modules/seasons/schemas/season.schemas';
import { assetTypes } from '@/shared/types';

export default createDomainApiHandler({
  assetType: assetTypes.seasons,
  createSchema: createSeasonSchema,
  updateSchema: updateSeasonSchema,
  keySchema: seasonKeySchema,
  buildSearchSelector: (body) => {
    const tvShowKey =
      typeof body.tvShowKey === 'string' && body.tvShowKey.trim()
        ? body.tvShowKey
        : undefined;

    return {
      '@assetType': assetTypes.seasons,
      ...(tvShowKey
        ? {
            tvShow: {
              '@assetType': assetTypes.tvShows,
              '@key': tvShowKey,
            },
          }
        : {}),
    };
  },
});
