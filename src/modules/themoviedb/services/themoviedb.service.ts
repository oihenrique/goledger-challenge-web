import type {
  TmdbSearchResponse,
  TmdbTvResult,
  TmdbEpisodeImagesResponse,
  TmdbEpisodeImage,
} from '@/modules/themoviedb/types/themoviedb.types';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export async function searchTmdbTvShows(
  query: string,
  signal?: AbortSignal,
): Promise<TmdbTvResult[]> {
  const response = await fetch(
    `/api/themoviedb/search?query=${encodeURIComponent(query)}`,
    {
      signal,
    },
  );

  if (!response.ok) {
    throw new Error(`TMDB search failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as TmdbSearchResponse;
  return payload.results ?? [];
}

export async function getTmdbEpisodeImages(
  seriesId: number,
  seasonNumber: number,
  episodeNumber: number,
  signal?: AbortSignal,
): Promise<TmdbEpisodeImage[]> {
  const response = await fetch(
    `/api/themoviedb/episode-images?seriesId=${seriesId}&seasonNumber=${seasonNumber}&episodeNumber=${episodeNumber}`,
    {
      signal,
    },
  );

  if (!response.ok) {
    throw new Error(
      `TMDB episode images failed with status ${response.status}.`,
    );
  }

  const payload = (await response.json()) as TmdbEpisodeImagesResponse;
  return payload.stills ?? [];
}

export function getBestTmdbSeriesId(
  results: TmdbTvResult[],
  query: string,
): number | undefined {
  if (results.length === 0) return undefined;

  const normalizedQuery = query.trim().toLowerCase();

  const exactMatch = results.find(
    (result) =>
      result.name.toLowerCase() === normalizedQuery ||
      result.original_name.toLowerCase() === normalizedQuery,
  );

  if (exactMatch?.id) {
    return exactMatch.id;
  }
  const firstWithGoodPopularity = results.find(
    (result) => result.popularity > 10,
  );
  if (firstWithGoodPopularity?.id) {
    return firstWithGoodPopularity.id;
  }

  return results[0]?.id;
}

export function getBestTmdbPosterUrl(
  results: TmdbTvResult[],
  query: string,
): string | undefined {
  if (results.length === 0) return undefined;

  const normalizedQuery = query.trim().toLowerCase();

  const exactMatch = results.find(
    (result) =>
      result.poster_path &&
      (result.name.toLowerCase() === normalizedQuery ||
        result.original_name.toLowerCase() === normalizedQuery),
  );

  if (exactMatch?.poster_path) {
    return `${TMDB_IMAGE_BASE_URL}${exactMatch.poster_path}`;
  }

  const firstWithImage = results.find((result) => result.poster_path);
  if (firstWithImage?.poster_path) {
    return `${TMDB_IMAGE_BASE_URL}${firstWithImage.poster_path}`;
  }

  return undefined;
}

export function getBestTmdbEpisodeImageUrl(
  images: TmdbEpisodeImage[],
): string | undefined {
  if (images.length === 0) return undefined;

  const sortedImages = images.sort((a, b) => {
    if (a.vote_average !== b.vote_average) {
      return b.vote_average - a.vote_average;
    }
    return b.vote_count - a.vote_count;
  });

  return `${TMDB_IMAGE_BASE_URL}${sortedImages[0].file_path}`;
}
