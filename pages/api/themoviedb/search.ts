import type { NextApiRequest, NextApiResponse } from 'next';
import { serverEnv } from '@/lib/env';

interface TmdbSearchResponse {
  results?: Array<unknown>;
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Check if TMDB image search is enabled
  if (!serverEnv.tmdbImageSearchEnabled) {
    response.status(200).json({ results: [] });
    return;
  }

  const { query } = request.query;
  const tmdbAccessToken = serverEnv.tmdbAccessToken;

  if (!tmdbAccessToken) {
    console.error('TMDB_ACCESS_TOKEN environment variable not set');
    response.status(500).json({
      error: 'TMDB configuration error',
      message: 'Missing authentication token',
    });
    return;
  }

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    response.status(400).json({ error: 'Query parameter is required' });
    return;
  }

  try {
    const url = new URL('https://api.themoviedb.org/3/search/tv');
    url.searchParams.append('query', query);
    url.searchParams.append('include_adult', 'false');
    url.searchParams.append('language', 'en-US');
    url.searchParams.append('page', '1');

    const externalResponse = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${tmdbAccessToken}`,
      },
    });

    if (!externalResponse.ok) {
      console.error(
        `TMDB API error: ${externalResponse.status}`,
        await externalResponse.text(),
      );
      response.status(externalResponse.status).json({
        error: 'External TMDB API request failed',
        status: externalResponse.status,
      });
      return;
    }

    const payload = (await externalResponse.json()) as TmdbSearchResponse;

    response.status(200).json(payload);
  } catch (error) {
    console.error('TMDB proxy error:', error);
    response.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
