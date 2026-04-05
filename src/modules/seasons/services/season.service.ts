import { internalApiRequest } from '@/lib/api/internal-api-client';
import type {
  CreateSeasonInput,
  PaginatedSeasonsResult,
  RawSeason,
  SearchSeasonsParams,
  SeasonKey,
  SeasonViewModel,
  UpdateSeasonInput,
} from '@/modules/seasons/types/season.types';
import {
  mapRawSeasonToViewModel,
  mapRawSeasonsToViewModels,
} from '@/modules/seasons/utils/season.mappers';
import type {
  CreateAssetResponse,
  DeleteAssetResponse,
  ReadAssetResponse,
  SearchResponse,
  UpdateAssetResponse,
} from '@/shared/types';

const seasonsBasePath = '/api/seasons';

export async function searchSeasons(
  signal?: AbortSignal,
): Promise<PaginatedSeasonsResult> {
  const response = await internalApiRequest<SearchResponse<RawSeason>>(
    `${seasonsBasePath}/search`,
    {
      method: 'POST',
      body: {},
      signal,
    },
  );

  return {
    items: mapRawSeasonsToViewModels(response.result),
    bookmark: response.metadata?.bookmark ?? null,
    fetchedRecordsCount:
      response.metadata?.fetchedRecordsCount ??
      response.metadata?.recordsCount ??
      null,
  };
}

export async function searchPaginatedSeasons(
  params: SearchSeasonsParams,
  signal?: AbortSignal,
): Promise<PaginatedSeasonsResult> {
  const response = await internalApiRequest<SearchResponse<RawSeason>>(
    `${seasonsBasePath}/search`,
    {
      method: 'POST',
      body: {
        limit: params.limit,
        bookmark: params.bookmark,
        tvShowKey: params.tvShowKey,
        searchTerm: params.searchTerm,
      },
      signal,
    },
  );

  return {
    items: mapRawSeasonsToViewModels(response.result),
    bookmark: response.metadata?.bookmark ?? null,
    fetchedRecordsCount:
      response.metadata?.fetchedRecordsCount ??
      response.metadata?.recordsCount ??
      null,
  };
}

export async function readSeason(
  key: SeasonKey,
  signal?: AbortSignal,
): Promise<SeasonViewModel> {
  const response = await internalApiRequest<ReadAssetResponse<RawSeason>>(
    `${seasonsBasePath}/read`,
    {
      method: 'POST',
      body: { key },
      signal,
    },
  );

  return mapRawSeasonToViewModel(response);
}

export async function createSeason(
  input: CreateSeasonInput,
): Promise<SeasonViewModel[]> {
  const response = await internalApiRequest<CreateAssetResponse<RawSeason>>(
    `${seasonsBasePath}/create`,
    {
      method: 'POST',
      body: input,
    },
  );

  return mapRawSeasonsToViewModels(response);
}

export async function updateSeason(
  input: UpdateSeasonInput,
): Promise<SeasonViewModel> {
  const response = await internalApiRequest<UpdateAssetResponse<RawSeason>>(
    `${seasonsBasePath}/update`,
    {
      method: 'PUT',
      body: input,
    },
  );

  return mapRawSeasonToViewModel(response);
}

export async function deleteSeason(key: SeasonKey): Promise<SeasonViewModel> {
  const response = await internalApiRequest<DeleteAssetResponse<RawSeason>>(
    `${seasonsBasePath}/delete`,
    {
      method: 'DELETE',
      body: key,
    },
  );

  return mapRawSeasonToViewModel(response);
}
