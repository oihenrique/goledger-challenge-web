import { createDomainApiHandler } from '@/lib/api/create-domain-api-handler';
import {
  createTvShowSchema,
  tvShowKeySchema,
  updateTvShowSchema,
} from '@/modules/tv-shows/schemas/tv-show.schemas';
import { assetTypes } from '@/shared/types/api-common.types';

export default createDomainApiHandler({
  assetType: assetTypes.tvShows,
  createSchema: createTvShowSchema,
  updateSchema: updateTvShowSchema,
  keySchema: tvShowKeySchema,
});
