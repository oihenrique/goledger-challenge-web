import type {
  RawWatchlist,
  WatchlistViewModel,
} from '@/modules/watchlists/types/watchlist.types';

export function mapRawWatchlistToViewModel(
  rawWatchlist: RawWatchlist,
): WatchlistViewModel {
  return {
    key: rawWatchlist['@key'],
    title: rawWatchlist.title,
    description: rawWatchlist.description,
    tvShowKeys: (rawWatchlist.tvShows ?? []).map((reference) => reference['@key']),
    updatedAt: rawWatchlist['@lastUpdated'],
    lastTransaction: rawWatchlist['@lastTx'],
    lastTransactionId: rawWatchlist['@lastTxID'],
  };
}

export function mapRawWatchlistsToViewModels(
  rawWatchlists: RawWatchlist[],
): WatchlistViewModel[] {
  return rawWatchlists.map(mapRawWatchlistToViewModel);
}
