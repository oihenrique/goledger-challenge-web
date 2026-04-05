import { useQueries } from '@tanstack/react-query';

import { searchTmdbTvShows } from '@/modules/themoviedb/services/themoviedb.service';

export function useMultipleTmdbTvShows(titles: string[]) {
  return useQueries({
    queries: titles.map((title) => ({
      queryKey: ['tmdb-tv-shows', title],
      queryFn: ({ signal }: { signal?: AbortSignal }) =>
        searchTmdbTvShows(title, signal),
      enabled: Boolean(title),
    })),
  });
}
