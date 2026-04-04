import type {
  TmdbSearchResponse,
  TmdbTvResult,
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

export function getBestTmdbPosterUrl(
  results: TmdbTvResult[],
  query: string,
): string | undefined {
  if (results.length === 0) return undefined;

  const normalizedQuery = query.trim().toLowerCase();

  // Primeiro tenta match exato com posterPath
  const exactMatch = results.find(
    (result) =>
      result.poster_path &&
      (result.name.toLowerCase() === normalizedQuery ||
        result.original_name.toLowerCase() === normalizedQuery),
  );

  if (exactMatch?.poster_path) {
    return `${TMDB_IMAGE_BASE_URL}${exactMatch.poster_path}`;
  }

  // Retorna o primeiro com imagem disponível
  const firstWithImage = results.find((result) => result.poster_path);
  if (firstWithImage?.poster_path) {
    return `${TMDB_IMAGE_BASE_URL}${firstWithImage.poster_path}`;
  }

  return undefined;
}
