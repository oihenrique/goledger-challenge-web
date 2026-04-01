import { createDomainApiHandler } from '@/lib/api/create-domain-api-handler';
import {
  createWatchlistSchema,
  updateWatchlistSchema,
  watchlistKeySchema,
} from '@/modules/watchlists/schemas/watchlist.schemas';
import { assetTypes } from '@/shared/types/api-common.types';

export default createDomainApiHandler({
  assetType: assetTypes.watchlist,
  createSchema: createWatchlistSchema,
  updateSchema: updateWatchlistSchema,
  keySchema: watchlistKeySchema,
});
