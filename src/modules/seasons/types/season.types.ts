import type {
  AssetReference,
  RawAssetHistoryMeta,
  RawAssetMeta,
} from '@/shared/types/api-common.types';

export interface RawSeason extends RawAssetMeta {
  '@assetType': 'seasons';
  number: number;
  tvShow: AssetReference<'tvShows'>;
  year: number;
}

export interface RawSeasonHistoryEntry extends RawAssetHistoryMeta {
  '@assetType': 'seasons';
  number: number;
  tvShow: AssetReference<'tvShows'>;
  year: number;
}

export interface SeasonKey {
  '@assetType': 'seasons';
  number: number;
  tvShow: AssetReference<'tvShows'>;
}

export interface CreateSeasonInput {
  '@assetType': 'seasons';
  number: number;
  tvShow: AssetReference<'tvShows'>;
  year: number;
}

export interface UpdateSeasonInput {
  '@assetType': 'seasons';
  number: number;
  tvShow: AssetReference<'tvShows'>;
  year: number;
}

export interface SeasonViewModel {
  key: string;
  number: number;
  year: number;
  tvShowKey: string;
  tvShowTitle?: string;
  updatedAt: string;
  lastTransaction: string;
}

export interface SearchSeasonsParams {
  bookmark?: string;
  limit?: number;
  searchTerm?: string;
}

export interface PaginatedSeasonsResult {
  items: SeasonViewModel[];
  bookmark: string | null;
  fetchedRecordsCount: number | null;
}
