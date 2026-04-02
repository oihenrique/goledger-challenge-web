import { useQuery } from '@tanstack/react-query';

import { tvShowQueryKeys } from '@/modules/tv-shows/constants/tv-show.query-keys';
import { searchPaginatedTvShows } from '@/modules/tv-shows/services/tv-show.service';
import type { SearchTvShowsParams } from '@/modules/tv-shows/types/tv-show.types';

export function useTvShows(params: SearchTvShowsParams) {
  return useQuery({
    queryKey: tvShowQueryKeys.list(params),
    queryFn: ({ signal }) => searchPaginatedTvShows(params, signal),
  });
}
