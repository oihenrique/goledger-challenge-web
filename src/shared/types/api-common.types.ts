export const assetTypes = {
  tvShows: 'tvShows',
  seasons: 'seasons',
  episodes: 'episodes',
  watchlist: 'watchlist',
} as const;

export type AssetType = (typeof assetTypes)[keyof typeof assetTypes];

export interface AssetReference<TAssetType extends AssetType = AssetType> {
  '@assetType': TAssetType;
  '@key': string;
}

export interface RawAssetMeta {
  '@assetType': AssetType;
  '@key': string;
  '@lastTouchBy': string;
  '@lastTx': string;
  '@lastTxID': string;
  '@lastUpdated': string;
}

export interface RawAssetHistoryMeta extends RawAssetMeta {
  _isDelete: boolean;
  _timestamp: string;
  _txId: string;
}

export interface AssetSchemaProperty {
  dataType: string;
  description: string;
  isKey: boolean;
  label: string;
  readOnly: boolean;
  required: boolean;
  tag: string;
  writers: string[] | null;
}

export interface TransactionArgument {
  dataType: string;
  description: string;
  label: string;
  private: boolean;
  required: boolean;
  tag: string;
}
