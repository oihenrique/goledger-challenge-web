export interface InternalApiErrorPayload {
  details?: unknown;
  error?: string;
  status?: number;
}

export class InternalApiError extends Error {
  status: number;
  payload: InternalApiErrorPayload | string | null;

  constructor(
    message: string,
    status: number,
    payload: InternalApiErrorPayload | string | null,
  ) {
    super(message);
    this.name = 'InternalApiError';
    this.status = status;
    this.payload = payload;
  }
}

type InternalApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface InternalApiRequestOptions {
  body?: unknown;
  headers?: HeadersInit;
  method?: InternalApiMethod;
  signal?: AbortSignal;
}

async function parseInternalApiResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

export async function internalApiRequest<TResponse>(
  path: string,
  options: InternalApiRequestOptions = {},
): Promise<TResponse> {
  const response = await fetch(path, {
    method: options.method ?? 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  const payload = await parseInternalApiResponse(response);

  if (!response.ok) {
    const message =
      typeof payload === 'object' &&
      payload !== null &&
      'error' in payload &&
      typeof payload.error === 'string'
        ? payload.error
        : `Internal API request failed with status ${response.status}`;

    throw new InternalApiError(
      message,
      response.status,
      (payload as InternalApiErrorPayload | string | null) ?? null,
    );
  }

  return payload as TResponse;
}
