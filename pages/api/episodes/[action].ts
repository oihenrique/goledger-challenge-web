import { createDomainApiHandler } from '@/lib/api/create-domain-api-handler';
import {
  createEpisodeSchema,
  episodeKeySchema,
  updateEpisodeSchema,
} from '@/modules/episodes/schemas/episode.schemas';
import { assetTypes } from '@/shared/types';

export default createDomainApiHandler({
  assetType: assetTypes.episodes,
  createSchema: createEpisodeSchema,
  updateSchema: updateEpisodeSchema,
  keySchema: episodeKeySchema,
  buildSearchSelector: (body) => {
    const seasonKey =
      typeof body.seasonKey === 'string' && body.seasonKey.trim()
        ? body.seasonKey
        : undefined;

    return {
      '@assetType': assetTypes.episodes,
      ...(seasonKey
        ? {
            season: {
              '@assetType': assetTypes.seasons,
              '@key': seasonKey,
            },
          }
        : {}),
    };
  },
});
