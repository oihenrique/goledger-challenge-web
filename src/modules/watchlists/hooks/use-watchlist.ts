import { useQuery } from '@tanstack/react-query';

import { readWatchlist } from '@/modules/watchlists/services/watchlist.service';
import type { WatchlistKey } from '@/modules/watchlists/types/watchlist.types';
import { watchlistQueryKeys } from '@/modules/watchlists/constants/watchlist.query-keys';

export function useWatchlist(key: WatchlistKey) {
  return useQuery({
    queryKey: watchlistQueryKeys.detail(key.title),
    queryFn: ({ signal }) => readWatchlist(key, signal),
  });
}
