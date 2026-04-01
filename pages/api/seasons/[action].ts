import { createDomainApiHandler } from '@/lib/api/create-domain-api-handler';
import {
  createSeasonSchema,
  seasonKeySchema,
  updateSeasonSchema,
} from '@/modules/seasons/schemas/season.schemas';
import { assetTypes } from '@/shared/types/api-common.types';

export default createDomainApiHandler({
  assetType: assetTypes.seasons,
  createSchema: createSeasonSchema,
  updateSchema: updateSeasonSchema,
  keySchema: seasonKeySchema,
});
