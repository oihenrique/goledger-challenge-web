import { internalApiRequest } from '@/lib/api/internal-api-client';
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

export async function searchTvShows(signal?: AbortSignal): Promise<
  PaginatedTvShowsResult
> {
  const response = await internalApiRequest<SearchResponse<RawTvShow>>(
    `${tvShowsBasePath}/search`,
    {
      method: 'POST',
      body: {},
      signal,
    },
  );

  return {
    items: mapRawTvShowsToViewModels(response.result),
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

  return {
    items: mapRawTvShowsToViewModels(response.result),
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

  return mapRawTvShowToViewModel(response);
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

  return mapRawTvShowsToViewModels(response);
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

  return mapRawTvShowToViewModel(response);
}

export async function deleteTvShow(key: TvShowKey): Promise<TvShowViewModel> {
  const response = await internalApiRequest<DeleteAssetResponse<RawTvShow>>(
    `${tvShowsBasePath}/delete`,
    {
      method: 'DELETE',
      body: key,
    },
  );

  return mapRawTvShowToViewModel(response);
}
