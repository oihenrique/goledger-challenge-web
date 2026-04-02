import { useQuery } from '@tanstack/react-query';

import { tvShowQueryKeys } from '@/modules/tv-shows/constants/tv-show.query-keys';
import { searchTvShows } from '@/modules/tv-shows/services/tv-show.service';

export function useTvShows() {
  return useQuery({
    queryKey: tvShowQueryKeys.list(),
    queryFn: ({ signal }) => searchTvShows(signal),
  });
}
