import type { AssetType } from '@/shared/types/api-common.types';

export interface SearchRequest {
  query: {
    selector: Record<string, unknown>;
    limit?: number;
    bookmark?: string;
  };
  collection?: string;
  resolve?: boolean;
}

export interface ReadAssetRequest<TKey> {
  key: TKey;
  resolve?: boolean;
}

export interface ReadAssetHistoryRequest<TKey> {
  key: TKey;
}

export interface CreateAssetRequest<TAsset> {
  asset: TAsset[];
}

export interface UpdateAssetRequest<TAsset> {
  update: TAsset;
}

export interface DeleteAssetRequest<TKey> {
  key: TKey;
}

export interface GetSchemaRequest {
  assetType: AssetType;
}

export interface GetTxRequest {
  txName: string;
}
