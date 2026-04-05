import type { NextApiRequest, NextApiResponse } from 'next';
import { serverEnv } from '@/lib/env';

interface TmdbEpisodeImagesResponse {
  id?: number;
  stills?: Array<unknown>;
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

  if (!serverEnv.tmdbImageSearchEnabled) {
    response.status(200).json({ id: 0, stills: [] });
    return;
  }

  const { seriesId, seasonNumber, episodeNumber } = request.query;
  const tmdbAccessToken = serverEnv.tmdbAccessToken;

  if (!tmdbAccessToken) {
    console.error('TMDB_ACCESS_TOKEN environment variable not set');
    response.status(500).json({
      error: 'TMDB configuration error',
      message: 'Missing authentication token',
    });
    return;
  }

  if (!seriesId || !seasonNumber || !episodeNumber) {
    response.status(400).json({
      error: 'Missing required parameters',
      message: 'seriesId, seasonNumber, and episodeNumber are required',
    });
    return;
  }

  try {
    const url = `https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/images`;

    const externalResponse = await fetch(url, {
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

    const payload =
      (await externalResponse.json()) as TmdbEpisodeImagesResponse;

    response.status(200).json(payload);
  } catch (error) {
    console.error('TMDB episode images proxy error:', error);
    response.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
