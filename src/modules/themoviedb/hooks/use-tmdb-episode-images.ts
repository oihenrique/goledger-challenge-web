import { useQuery } from '@tanstack/react-query';

import { getTmdbEpisodeImages } from '@/modules/themoviedb/services/themoviedb.service';
import type { TmdbEpisodeImage } from '@/modules/themoviedb/types/themoviedb.types';

export function useTmdbEpisodeImages(
  seriesId: number | null | undefined,
  seasonNumber: number | null | undefined,
  episodeNumber: number | null | undefined,
) {
  return useQuery<TmdbEpisodeImage[]>({
    queryKey: ['tmdb-episode-images', seriesId, seasonNumber, episodeNumber],
    queryFn: ({ signal }) => {
      if (!seriesId || !seasonNumber || !episodeNumber) {
        return Promise.resolve([]);
      }

      return getTmdbEpisodeImages(
        seriesId,
        seasonNumber,
        episodeNumber,
        signal,
      );
    },
    enabled: Boolean(seriesId && seasonNumber && episodeNumber),
  });
}
