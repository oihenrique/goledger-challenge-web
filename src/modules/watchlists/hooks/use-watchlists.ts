import { useQuery } from '@tanstack/react-query';

import { watchlistQueryKeys } from '@/modules/watchlists/constants/watchlist.query-keys';
import { searchWatchlists } from '@/modules/watchlists/services/watchlist.service';
import type { SearchWatchlistsParams } from '@/modules/watchlists/types/watchlist.types';

export function useWatchlists(params: SearchWatchlistsParams = {}) {
  return useQuery({
    queryKey: watchlistQueryKeys.list(params),
    queryFn: ({ signal }) => searchWatchlists(params, signal),
  });
}
