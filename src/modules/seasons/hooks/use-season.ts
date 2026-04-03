import { useQuery } from '@tanstack/react-query';

import { seasonQueryKeys } from '@/modules/seasons/constants/season.query-keys';
import { readSeason } from '@/modules/seasons/services/season.service';
import type { SeasonKey } from '@/modules/seasons/types/season.types';

export function useSeason(key: SeasonKey | null) {
  return useQuery({
    queryKey: seasonQueryKeys.detail(key?.tvShow['@key'] ?? '', key?.number ?? 0),
    queryFn: ({ signal }) => {
      if (!key) {
        throw new Error('Season key is required.');
      }

      return readSeason(key, signal);
    },
    enabled: Boolean(key?.tvShow['@key']) && Boolean(key?.number),
  });
}
