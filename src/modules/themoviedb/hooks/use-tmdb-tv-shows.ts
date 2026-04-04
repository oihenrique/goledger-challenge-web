import { useQuery } from '@tanstack/react-query';

import { searchTmdbTvShows } from '@/modules/themoviedb/services/themoviedb.service';
import type { TmdbTvResult } from '@/modules/themoviedb/types/themoviedb.types';

export function useTmdbTvShows(query: string | null | undefined) {
  return useQuery<TmdbTvResult[]>({
    queryKey: ['tmdb-tv-shows', query],
    queryFn: ({ signal }) => {
      if (!query) {
        return Promise.resolve([]);
      }

      return searchTmdbTvShows(query, signal);
    },
    enabled: Boolean(query),
  });
}
