import { internalApiRequest } from '@/lib/api/internal-api-client';
import type {
  CreateEpisodeInput,
  EpisodeKey,
  EpisodeViewModel,
  PaginatedEpisodesResult,
  RawEpisode,
  SearchEpisodesParams,
  UpdateEpisodeInput,
} from '@/modules/episodes/types/episode.types';
import {
  mapRawEpisodeToViewModel,
  mapRawEpisodesToViewModels,
} from '@/modules/episodes/utils/episode.mappers';
import type {
  CreateAssetResponse,
  DeleteAssetResponse,
  ReadAssetResponse,
  SearchResponse,
  UpdateAssetResponse,
} from '@/shared/types';

const episodesBasePath = '/api/episodes';

export async function searchEpisodes(
  signal?: AbortSignal,
): Promise<PaginatedEpisodesResult> {
  const response = await internalApiRequest<SearchResponse<RawEpisode>>(
    `${episodesBasePath}/search`,
    {
      method: 'POST',
      body: {},
      signal,
    },
  );

  return {
    items: mapRawEpisodesToViewModels(response.result),
    bookmark: response.metadata?.bookmark ?? null,
    fetchedRecordsCount:
      response.metadata?.fetchedRecordsCount ??
      response.metadata?.recordsCount ??
      null,
  };
}

export async function searchPaginatedEpisodes(
  params: SearchEpisodesParams,
  signal?: AbortSignal,
): Promise<PaginatedEpisodesResult> {
  const response = await internalApiRequest<SearchResponse<RawEpisode>>(
    `${episodesBasePath}/search`,
    {
      method: 'POST',
      body: {
        limit: params.limit,
        bookmark: params.bookmark,
        seasonKey: params.seasonKey,
        searchTerm: params.searchTerm,
      },
      signal,
    },
  );

  return {
    items: mapRawEpisodesToViewModels(response.result),
    bookmark: response.metadata?.bookmark ?? null,
    fetchedRecordsCount:
      response.metadata?.fetchedRecordsCount ??
      response.metadata?.recordsCount ??
      null,
  };
}

export async function readEpisode(
  key: EpisodeKey,
  signal?: AbortSignal,
): Promise<EpisodeViewModel> {
  const response = await internalApiRequest<ReadAssetResponse<RawEpisode>>(
    `${episodesBasePath}/read`,
    {
      method: 'POST',
      body: { key },
      signal,
    },
  );

  return mapRawEpisodeToViewModel(response);
}

export async function createEpisode(
  input: CreateEpisodeInput,
): Promise<EpisodeViewModel[]> {
  const response = await internalApiRequest<CreateAssetResponse<RawEpisode>>(
    `${episodesBasePath}/create`,
    {
      method: 'POST',
      body: input,
    },
  );

  return mapRawEpisodesToViewModels(response);
}

export async function updateEpisode(
  input: UpdateEpisodeInput,
): Promise<EpisodeViewModel> {
  const response = await internalApiRequest<UpdateAssetResponse<RawEpisode>>(
    `${episodesBasePath}/update`,
    {
      method: 'PUT',
      body: input,
    },
  );

  return mapRawEpisodeToViewModel(response);
}

export async function deleteEpisode(
  key: EpisodeKey,
): Promise<EpisodeViewModel> {
  const response = await internalApiRequest<DeleteAssetResponse<RawEpisode>>(
    `${episodesBasePath}/delete`,
    {
      method: 'DELETE',
      body: key,
    },
  );

  return mapRawEpisodeToViewModel(response);
}
