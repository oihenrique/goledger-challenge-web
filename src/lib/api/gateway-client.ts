import { serverEnv } from '@/lib/env';
import type {
  CreateAssetRequest,
  DeleteAssetRequest,
  GetSchemaRequest,
  GetTxRequest,
  ReadAssetHistoryRequest,
  ReadAssetRequest,
  SearchRequest,
  UpdateAssetRequest,
} from '@/shared/types/api-request.types';
import type {
  AssetSchemaListItem,
  AssetSchemaResponse,
  ChainInfoResponse,
  ChaincodeHeaderResponse,
  CreateAssetResponse,
  DeleteAssetResponse,
  ReadAssetHistoryResponse,
  ReadAssetResponse,
  SearchResponse,
  TransactionDefinition,
  TransactionListItem,
  UpdateAssetResponse,
} from '@/shared/types/api-response.types';

type GatewayHttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface GatewayRequestOptions {
  method?: GatewayHttpMethod;
  body?: unknown;
}

interface GatewayTarget {
  channelName: string;
  chaincodeName: string;
}

const defaultGatewayTarget: GatewayTarget = {
  channelName: 'mainchannel',
  chaincodeName: 'streaming-cc',
};

export class GatewayApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = 'GatewayApiError';
    this.status = status;
    this.payload = payload;
  }
}

function createBasicAuthHeader(): string {
  const credentials = Buffer.from(
    `${serverEnv.apiBasicAuthUser}:${serverEnv.apiBasicAuthPassword}`,
  ).toString('base64');

  return `Basic ${credentials}`;
}

function buildGatewayUrl(path: string): string {
  const normalizedBaseUrl = serverEnv.apiBaseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
}

async function parseGatewayResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

async function gatewayRequest<TResponse>(
  path: string,
  options: GatewayRequestOptions = {},
): Promise<TResponse> {
  const response = await fetch(buildGatewayUrl(path), {
    method: options.method ?? 'GET',
    headers: {
      Authorization: createBasicAuthHeader(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = await parseGatewayResponse(response);

  if (!response.ok) {
    const message =
      typeof payload === 'object' &&
      payload !== null &&
      'error' in payload &&
      typeof payload.error === 'string'
        ? payload.error
        : `Gateway request failed with status ${response.status}`;

    throw new GatewayApiError(message, response.status, payload);
  }

  return payload as TResponse;
}

function buildChannelChaincodePath(
  path: string,
  target: GatewayTarget = defaultGatewayTarget,
): string {
  return `/${target.channelName}/${target.chaincodeName}${path}`;
}

export function getDefaultGatewayTarget(): GatewayTarget {
  return defaultGatewayTarget;
}

export function getGatewayHeader(): Promise<ChaincodeHeaderResponse> {
  return gatewayRequest<ChaincodeHeaderResponse>('/query/getHeader');
}

export function getGatewayHeaderForTarget(
  target: GatewayTarget = defaultGatewayTarget,
): Promise<ChaincodeHeaderResponse> {
  return gatewayRequest<ChaincodeHeaderResponse>(
    buildChannelChaincodePath('/query/getHeader', target),
  );
}

export function listAssetSchemas(): Promise<AssetSchemaListItem[]> {
  return gatewayRequest<AssetSchemaListItem[]>('/query/getSchema');
}

export function getAssetSchema(
  body: GetSchemaRequest,
): Promise<AssetSchemaResponse> {
  return gatewayRequest<AssetSchemaResponse>('/query/getSchema', {
    method: 'POST',
    body,
  });
}

export function listTransactions(): Promise<TransactionListItem[]> {
  return gatewayRequest<TransactionListItem[]>('/query/getTx');
}

export function getTransactionDefinition(
  body: GetTxRequest,
): Promise<TransactionDefinition> {
  return gatewayRequest<TransactionDefinition>('/query/getTx', {
    method: 'POST',
    body,
  });
}

export function searchAssets<TItem>(
  body: SearchRequest,
): Promise<SearchResponse<TItem>> {
  return gatewayRequest<SearchResponse<TItem>>('/query/search', {
    method: 'POST',
    body,
  });
}

export function readAsset<TItem, TKey>(
  body: ReadAssetRequest<TKey>,
): Promise<ReadAssetResponse<TItem>> {
  return gatewayRequest<ReadAssetResponse<TItem>>('/query/readAsset', {
    method: 'POST',
    body,
  });
}

export function readAssetHistory<TItem, TKey>(
  body: ReadAssetHistoryRequest<TKey>,
): Promise<ReadAssetHistoryResponse<TItem>> {
  return gatewayRequest<ReadAssetHistoryResponse<TItem>>(
    '/query/readAssetHistory',
    {
      method: 'POST',
      body,
    },
  );
}

export function createAssets<TItem, TAsset>(
  body: CreateAssetRequest<TAsset>,
): Promise<CreateAssetResponse<TItem>> {
  return gatewayRequest<CreateAssetResponse<TItem>>('/invoke/createAsset', {
    method: 'POST',
    body,
  });
}

export function updateAsset<TItem, TAsset>(
  body: UpdateAssetRequest<TAsset>,
): Promise<UpdateAssetResponse<TItem>> {
  return gatewayRequest<UpdateAssetResponse<TItem>>('/invoke/updateAsset', {
    method: 'PUT',
    body,
  });
}

export function deleteAsset<TItem, TKey>(
  body: DeleteAssetRequest<TKey>,
): Promise<DeleteAssetResponse<TItem>> {
  return gatewayRequest<DeleteAssetResponse<TItem>>('/invoke/deleteAsset', {
    method: 'DELETE',
    body,
  });
}

export function getChainInfo(
  channelName = defaultGatewayTarget.channelName,
): Promise<ChainInfoResponse> {
  return gatewayRequest<ChainInfoResponse>(`/${channelName}/qscc/getChainInfo`);
}
