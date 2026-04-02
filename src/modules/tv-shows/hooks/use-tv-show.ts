import { useQuery } from '@tanstack/react-query';

import { tvShowQueryKeys } from '@/modules/tv-shows/constants/tv-show.query-keys';
import { readTvShow } from '@/modules/tv-shows/services/tv-show.service';
import type { TvShowKey } from '@/modules/tv-shows/types/tv-show.types';

export function useTvShow(key: TvShowKey | null) {
  return useQuery({
    queryKey: tvShowQueryKeys.detail(key?.title ?? ''),
    queryFn: ({ signal }) => {
      if (!key) {
        throw new Error('TV show key is required.');
      }

      return readTvShow(key, signal);
    },
    enabled: Boolean(key?.title),
  });
}
