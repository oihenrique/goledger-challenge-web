import { createDomainApiHandler } from '@/lib/api/create-domain-api-handler';
import {
  createWatchlistSchema,
  updateWatchlistSchema,
  watchlistKeySchema,
} from '@/modules/watchlists/schemas/watchlist.schemas';
import { assetTypes } from '@/shared/types';

function escapeCouchRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default createDomainApiHandler({
  assetType: assetTypes.watchlist,
  createSchema: createWatchlistSchema,
  updateSchema: updateWatchlistSchema,
  keySchema: watchlistKeySchema,
  buildSearchSelector: ({ searchTerm }) => {
    if (!searchTerm) {
      return {
        '@assetType': assetTypes.watchlist,
      };
    }

    const normalizedSearchTerm = escapeCouchRegex(searchTerm.trim());

    return {
      '@assetType': assetTypes.watchlist,
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
