import type {
  RawAssetHistoryMeta,
  RawAssetMeta,
} from '@/shared/types/api-common.types';

export interface RawTvShow extends RawAssetMeta {
  '@assetType': 'tvShows';
  title: string;
  description: string;
  recommendedAge: number;
}

export interface RawTvShowHistoryEntry extends RawAssetHistoryMeta {
  '@assetType': 'tvShows';
  title: string;
  description: string;
  recommendedAge: number;
}

export interface TvShowKey {
  '@assetType': 'tvShows';
  title: string;
}

export interface CreateTvShowInput {
  '@assetType': 'tvShows';
  title: string;
  description: string;
  recommendedAge: number;
}

export interface UpdateTvShowInput {
  '@assetType': 'tvShows';
  title: string;
  description: string;
  recommendedAge: number;
}

export interface TvShowViewModel {
  key: string;
  title: string;
  description: string;
  recommendedAge: number;
  updatedAt: string;
  lastTransaction: string;
  lastTransactionId: string;
}
