import { createDomainApiHandler } from '@/lib/api/create-domain-api-handler';
import {
  createEpisodeSchema,
  episodeKeySchema,
  updateEpisodeSchema,
} from '@/modules/episodes/schemas/episode.schemas';
import { assetTypes } from '@/shared/types/api-common.types';

export default createDomainApiHandler({
  assetType: assetTypes.episodes,
  createSchema: createEpisodeSchema,
  updateSchema: updateEpisodeSchema,
  keySchema: episodeKeySchema,
});
