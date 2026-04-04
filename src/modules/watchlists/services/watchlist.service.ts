import { internalApiRequest } from '@/lib/api/internal-api-client';
import type {
  CreateWatchlistInput,
  PaginatedWatchlistsResult,
  RawWatchlist,
  SearchWatchlistsParams,
  UpdateWatchlistInput,
  WatchlistKey,
  WatchlistViewModel,
} from '@/modules/watchlists/types/watchlist.types';
import {
  mapRawWatchlistToViewModel,
  mapRawWatchlistsToViewModels,
} from '@/modules/watchlists/utils/watchlist.mappers';
import type {
  CreateAssetResponse,
  DeleteAssetResponse,
  ReadAssetResponse,
  SearchResponse,
  UpdateAssetResponse,
} from '@/shared/types';

const watchlistsBasePath = '/api/watchlists';

export async function searchWatchlists(
  params: SearchWatchlistsParams = {},
  signal?: AbortSignal,
): Promise<PaginatedWatchlistsResult> {
  const response = await internalApiRequest<SearchResponse<RawWatchlist>>(
    `${watchlistsBasePath}/search`,
    {
      method: 'POST',
      body: {
        bookmark: params.bookmark,
        limit: params.limit,
        searchTerm: params.searchTerm,
      },
      signal,
    },
  );

  return {
    items: mapRawWatchlistsToViewModels(response.result),
    bookmark: response.metadata?.bookmark ?? null,
    fetchedRecordsCount:
      response.metadata?.fetchedRecordsCount ??
      response.metadata?.recordsCount ??
      null,
  };
}

export async function readWatchlist(
  key: WatchlistKey,
  signal?: AbortSignal,
): Promise<WatchlistViewModel> {
  const response = await internalApiRequest<ReadAssetResponse<RawWatchlist>>(
    `${watchlistsBasePath}/read`,
    {
      method: 'POST',
      body: { key },
      signal,
    },
  );

  return mapRawWatchlistToViewModel(response);
}

export async function createWatchlist(
  input: CreateWatchlistInput,
): Promise<WatchlistViewModel[]> {
  const response = await internalApiRequest<CreateAssetResponse<RawWatchlist>>(
    `${watchlistsBasePath}/create`,
    {
      method: 'POST',
      body: input,
    },
  );

  return mapRawWatchlistsToViewModels(response);
}

export async function updateWatchlist(
  input: UpdateWatchlistInput,
): Promise<WatchlistViewModel> {
  const response = await internalApiRequest<UpdateAssetResponse<RawWatchlist>>(
    `${watchlistsBasePath}/update`,
    {
      method: 'PUT',
      body: input,
    },
  );

  return mapRawWatchlistToViewModel(response);
}

export async function deleteWatchlist(
  key: WatchlistKey,
): Promise<WatchlistViewModel> {
  const response = await internalApiRequest<DeleteAssetResponse<RawWatchlist>>(
    `${watchlistsBasePath}/delete`,
    {
      method: 'DELETE',
      body: key,
    },
  );

  return mapRawWatchlistToViewModel(response);
}
