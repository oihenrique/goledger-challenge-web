import type {
  AssetReference,
  RawAssetHistoryMeta,
  RawAssetMeta,
} from '@/shared/types/api-common.types';

export interface RawWatchlist extends RawAssetMeta {
  '@assetType': 'watchlist';
  title: string;
  description?: string;
  tvShows?: AssetReference<'tvShows'>[];
}

export interface RawWatchlistHistoryEntry extends RawAssetHistoryMeta {
  '@assetType': 'watchlist';
  title: string;
  description?: string;
  tvShows?: AssetReference<'tvShows'>[];
}

export interface WatchlistKey {
  '@assetType': 'watchlist';
  title: string;
}

export interface CreateWatchlistInput {
  '@assetType': 'watchlist';
  title: string;
  description?: string;
  tvShows?: AssetReference<'tvShows'>[];
}

export interface UpdateWatchlistInput {
  '@assetType': 'watchlist';
  title: string;
  description?: string;
  tvShows?: AssetReference<'tvShows'>[];
}

export interface WatchlistViewModel {
  key: string;
  title: string;
  description?: string;
  tvShowKeys: string[];
  tvShowTitles?: string[];
  updatedAt: string;
  lastTransaction: string;
  lastTransactionId: string;
}

export interface SearchWatchlistsParams {
  bookmark?: string;
  limit?: number;
  searchTerm?: string;
}

export interface PaginatedWatchlistsResult {
  items: WatchlistViewModel[];
  bookmark: string | null;
  fetchedRecordsCount: number | null;
}
