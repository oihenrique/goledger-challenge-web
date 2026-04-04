import type { TvShowViewModel } from '@/modules/tv-shows/types/tv-show.types';
import type { WatchlistViewModel } from '@/modules/watchlists/types/watchlist.types';

export function getWatchlistTvShows(
  watchlist: WatchlistViewModel | null,
  tvShows: TvShowViewModel[],
): TvShowViewModel[] {
  if (!watchlist) {
    return [];
  }

  const tvShowsByKey = new Map(tvShows.map((tvShow) => [tvShow.key, tvShow]));

  return watchlist.tvShowKeys
    .map((tvShowKey) => tvShowsByKey.get(tvShowKey) ?? null)
    .filter((tvShow): tvShow is TvShowViewModel => tvShow !== null);
}

export function buildWatchlistTvShowReferences(tvShowKeys: string[]) {
  return tvShowKeys.map((tvShowKey) => ({
    '@assetType': 'tvShows' as const,
    '@key': tvShowKey,
  }));
}
