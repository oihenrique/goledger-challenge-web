import { useQuery } from '@tanstack/react-query';

import { episodeQueryKeys } from '@/modules/episodes/constants/episode.query-keys';
import { searchPaginatedEpisodes } from '@/modules/episodes/services/episode.service';
import type { SearchEpisodesParams } from '@/modules/episodes/types/episode.types';

export function useEpisodes(params: SearchEpisodesParams) {
  return useQuery({
    queryKey: episodeQueryKeys.list(params),
    queryFn: ({ signal }) => searchPaginatedEpisodes(params, signal),
  });
}
