import { useQuery } from '@tanstack/react-query';

import { episodeQueryKeys } from '@/modules/episodes/constants/episode.query-keys';
import { readEpisode } from '@/modules/episodes/services/episode.service';
import type { EpisodeKey } from '@/modules/episodes/types/episode.types';

export function useEpisode(key: EpisodeKey | null) {
  return useQuery({
    queryKey: episodeQueryKeys.detail(
      key?.season['@key'] ?? '',
      key?.episodeNumber ?? 1,
    ),
    queryFn: ({ signal }) => {
      if (!key) {
        throw new Error('Episode key is required.');
      }

      return readEpisode(key, signal);
    },
    enabled: Boolean(key?.season['@key']) && Boolean(key?.episodeNumber),
  });
}
