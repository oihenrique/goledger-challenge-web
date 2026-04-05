import { useQueries } from '@tanstack/react-query';

import { getTmdbEpisodeImages } from '@/modules/themoviedb/services/themoviedb.service';

interface EpisodeImageRequest {
  tmdbSeriesId: number;
  seasonNumber: number;
  episodeNumber: number;
}

export function useMultipleTmdbEpisodeImages(episodes: EpisodeImageRequest[]) {
  return useQueries({
    queries: episodes.map((episode) => ({
      queryKey: [
        'tmdb-episode-images',
        episode.tmdbSeriesId,
        episode.seasonNumber,
        episode.episodeNumber,
      ],
      queryFn: ({ signal }: { signal?: AbortSignal }) =>
        getTmdbEpisodeImages(
          episode.tmdbSeriesId,
          episode.seasonNumber,
          episode.episodeNumber,
          signal,
        ),
      enabled: Boolean(
        episode.tmdbSeriesId && episode.seasonNumber && episode.episodeNumber,
      ),
    })),
  });
}
