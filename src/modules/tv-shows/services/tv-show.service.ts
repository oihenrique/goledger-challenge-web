import { internalApiRequest } from '@/lib/api/internal-api-client';
import {
  getBestTmdbPosterUrl,
  searchTmdbTvShows,
} from '@/modules/themoviedb/services/themoviedb.service';
import type {
  CreateTvShowInput,
  PaginatedTvShowsResult,
  RawTvShow,
  SearchTvShowsParams,
  TvShowKey,
  TvShowViewModel,
  UpdateTvShowInput,
} from '@/modules/tv-shows/types/tv-show.types';
import {
  mapRawTvShowToViewModel,
  mapRawTvShowsToViewModels,
} from '@/modules/tv-shows/utils/tv-show.mappers';
import type {
  CreateAssetResponse,
  DeleteAssetResponse,
  ReadAssetResponse,
  SearchResponse,
  UpdateAssetResponse,
} from '@/shared/types';

const tvShowsBasePath = '/api/tv-shows';

async function enrichTvShowWithCoverImage(
  tvShow: RawTvShow,
): Promise<{ tvShow: RawTvShow; coverImageUrl?: string }> {
  try {
    const results = await searchTmdbTvShows(tvShow.title);
    const coverImageUrl = getBestTmdbPosterUrl(results, tvShow.title);
    return { tvShow, coverImageUrl };
  } catch (error) {
    console.warn(`Failed to fetch cover image for "${tvShow.title}":`, error);
    return { tvShow };
  }
}

async function enrichTvShowsWithCoverImages(
  tvShows: RawTvShow[],
): Promise<Record<string, string>> {
  const enrichedResults = await Promise.allSettled(
    tvShows.map((tvShow) => enrichTvShowWithCoverImage(tvShow)),
  );

  const coverImageUrls: Record<string, string> = {};

  for (const result of enrichedResults) {
    if (result.status === 'fulfilled' && result.value.coverImageUrl) {
      coverImageUrls[result.value.tvShow.title] = result.value.coverImageUrl;
    }
  }

  return coverImageUrls;
}

export async function searchTvShows(
  signal?: AbortSignal,
): Promise<PaginatedTvShowsResult> {
  const response = await internalApiRequest<SearchResponse<RawTvShow>>(
    `${tvShowsBasePath}/search`,
    {
      method: 'POST',
      body: {},
      signal,
    },
  );

  const coverImageUrls = await enrichTvShowsWithCoverImages(response.result);

  return {
    items: mapRawTvShowsToViewModels(response.result, coverImageUrls),
    bookmark: response.metadata?.bookmark ?? null,
    fetchedRecordsCount:
      response.metadata?.fetchedRecordsCount ??
      response.metadata?.recordsCount ??
      null,
  };
}

export async function searchPaginatedTvShows(
  params: SearchTvShowsParams,
  signal?: AbortSignal,
): Promise<PaginatedTvShowsResult> {
  const response = await internalApiRequest<SearchResponse<RawTvShow>>(
    `${tvShowsBasePath}/search`,
    {
      method: 'POST',
      body: {
        limit: params.limit,
        bookmark: params.bookmark,
        searchTerm: params.searchTerm,
      },
      signal,
    },
  );

  const coverImageUrls = await enrichTvShowsWithCoverImages(response.result);

  return {
    items: mapRawTvShowsToViewModels(response.result, coverImageUrls),
    bookmark: response.metadata?.bookmark ?? null,
    fetchedRecordsCount:
      response.metadata?.fetchedRecordsCount ??
      response.metadata?.recordsCount ??
      null,
  };
}

export async function readTvShow(
  key: TvShowKey,
  signal?: AbortSignal,
): Promise<TvShowViewModel> {
  const response = await internalApiRequest<ReadAssetResponse<RawTvShow>>(
    `${tvShowsBasePath}/read`,
    {
      method: 'POST',
      body: { key },
      signal,
    },
  );

  const { tvShow, coverImageUrl } = await enrichTvShowWithCoverImage(response);

  return mapRawTvShowToViewModel(tvShow, coverImageUrl);
}

export async function createTvShow(
  input: CreateTvShowInput,
): Promise<TvShowViewModel[]> {
  const response = await internalApiRequest<CreateAssetResponse<RawTvShow>>(
    `${tvShowsBasePath}/create`,
    {
      method: 'POST',
      body: input,
    },
  );

  const coverImageUrls = await enrichTvShowsWithCoverImages(response);

  return mapRawTvShowsToViewModels(response, coverImageUrls);
}

export async function updateTvShow(
  input: UpdateTvShowInput,
): Promise<TvShowViewModel> {
  const response = await internalApiRequest<UpdateAssetResponse<RawTvShow>>(
    `${tvShowsBasePath}/update`,
    {
      method: 'PUT',
      body: input,
    },
  );

  const { tvShow, coverImageUrl } = await enrichTvShowWithCoverImage(response);

  return mapRawTvShowToViewModel(tvShow, coverImageUrl);
}

export async function deleteTvShow(key: TvShowKey): Promise<TvShowViewModel> {
  const response = await internalApiRequest<DeleteAssetResponse<RawTvShow>>(
    `${tvShowsBasePath}/delete`,
    {
      method: 'DELETE',
      body: key,
    },
  );

  const { tvShow, coverImageUrl } = await enrichTvShowWithCoverImage(response);

  return mapRawTvShowToViewModel(tvShow, coverImageUrl);
}
