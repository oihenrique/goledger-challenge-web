import { createDomainApiHandler } from '@/lib/api/create-domain-api-handler';
import {
  createTvShowSchema,
  tvShowKeySchema,
  updateTvShowSchema,
} from '@/modules/tv-shows/schemas/tv-show.schemas';
import { assetTypes } from '@/shared/types';

function escapeCouchRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default createDomainApiHandler({
  assetType: assetTypes.tvShows,
  createSchema: createTvShowSchema,
  updateSchema: updateTvShowSchema,
  keySchema: tvShowKeySchema,
  buildSearchSelector: ({ searchTerm }) => {
    if (!searchTerm || typeof searchTerm !== 'string') {
      return {
        '@assetType': assetTypes.tvShows,
      };
    }

    const normalizedSearchTerm = escapeCouchRegex(searchTerm.trim());

    return {
      '@assetType': assetTypes.tvShows,
      $or: [
        {
          title: {
            $regex: `(?i)${normalizedSearchTerm}`,
          },
        },
        {
          description: {
            $regex: `(?i)${normalizedSearchTerm}`,
          },
        },
      ],
    };
  },
});
