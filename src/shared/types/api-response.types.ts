import type {
  AssetSchemaProperty,
  AssetType,
  TransactionArgument,
} from '@/shared/types/api-common.types';

export interface SearchResponse<TItem> {
  metadata: unknown | null;
  result: TItem[];
}

export type ReadAssetResponse<TItem> = TItem;
export type ReadAssetHistoryResponse<TItem> = TItem[];
export type CreateAssetResponse<TItem> = TItem[];
export type UpdateAssetResponse<TItem> = TItem;
export type DeleteAssetResponse<TItem> = TItem;

export interface AssetSchemaResponse {
  description: string;
  label: string;
  props: AssetSchemaProperty[];
  tag: AssetType;
}

export interface AssetSchemaListItem {
  description: string;
  dynamic: boolean;
  label: string;
  tag: AssetType | 'assetTypeListData';
  writers: string[] | null;
}

export interface TransactionDefinition {
  args: TransactionArgument[];
  description: string;
  label: string;
  metaTx: boolean;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  readOnly: boolean;
  tag: string;
}

export interface TransactionListItem {
  callers?: Array<{
    attributes: Record<string, unknown> | null;
    msp: string;
    ou: string;
  }>;
  description: string;
  label: string;
  tag: string;
}

export interface ChaincodeHeaderResponse {
  ccToolsVersion: string;
  colors: string[];
  name: string;
  orgMSP: string;
  orgTitle: string;
  version: string;
}

export interface ChainInfoResponse {
  current_block_hash: string;
  height: number;
  previous_block_hash: string;
}
