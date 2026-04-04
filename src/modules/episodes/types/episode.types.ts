import type {
  AssetReference,
  RawAssetHistoryMeta,
  RawAssetMeta,
} from '@/shared/types/api-common.types';

export interface RawEpisode extends RawAssetMeta {
  '@assetType': 'episodes';
  season: AssetReference<'seasons'>;
  episodeNumber: number;
  title: string;
  releaseDate: string;
  description: string;
  rating?: number;
}

export interface RawEpisodeHistoryEntry extends RawAssetHistoryMeta {
  '@assetType': 'episodes';
  season: AssetReference<'seasons'>;
  episodeNumber: number;
  title: string;
  releaseDate: string;
  description: string;
  rating?: number;
}

export interface EpisodeKey {
  '@assetType': 'episodes';
  season: AssetReference<'seasons'>;
  episodeNumber: number;
}

export interface CreateEpisodeInput {
  '@assetType': 'episodes';
  season: AssetReference<'seasons'>;
  episodeNumber: number;
  title: string;
  releaseDate: string;
  description: string;
  rating?: number;
}

export interface UpdateEpisodeInput {
  '@assetType': 'episodes';
  season: AssetReference<'seasons'>;
  episodeNumber: number;
  title: string;
  releaseDate: string;
  description: string;
  rating?: number;
}

export interface EpisodeViewModel {
  key: string;
  episodeNumber: number;
  title: string;
  description: string;
  releaseDate: string;
  rating?: number;
  seasonKey: string;
  tvShowKey?: string;
  tvShowTitle?: string;
  updatedAt: string;
  lastTransaction: string;
  lastTransactionId: string;
}

export interface EpisodeRelationViewModel extends EpisodeViewModel {
  seasonNumber?: number;
  seasonYear?: number;
  tvShowKey?: string;
  tvShowTitle?: string;
}

export interface SearchEpisodesParams {
  bookmark?: string;
  limit?: number;
  seasonKey?: string;
  searchTerm?: string;
}

export interface PaginatedEpisodesResult {
  items: EpisodeViewModel[];
  bookmark: string | null;
  fetchedRecordsCount: number | null;
}
