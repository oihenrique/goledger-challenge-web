import { useMutation, useQueryClient } from '@tanstack/react-query';

import { watchlistQueryKeys } from '@/modules/watchlists/constants/watchlist.query-keys';
import {
  createWatchlist,
  deleteWatchlist,
  updateWatchlist,
} from '@/modules/watchlists/services/watchlist.service';
import type {
  CreateWatchlistInput,
  UpdateWatchlistInput,
  WatchlistKey,
} from '@/modules/watchlists/types/watchlist.types';

export function useCreateWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateWatchlistInput) => createWatchlist(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: watchlistQueryKeys.lists(),
      });
    },
  });
}

export function useUpdateWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateWatchlistInput) => updateWatchlist(input),
    onSuccess: (watchlist, input) => {
      void queryClient.invalidateQueries({
        queryKey: watchlistQueryKeys.lists(),
      });
      queryClient.removeQueries({
        queryKey: watchlistQueryKeys.detail(input.title),
      });
      queryClient.setQueryData(
        watchlistQueryKeys.detail(watchlist.title),
        watchlist,
      );
    },
  });
}

export function useDeleteWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key: WatchlistKey) => deleteWatchlist(key),
    onSuccess: (_, key) => {
      void queryClient.invalidateQueries({
        queryKey: watchlistQueryKeys.lists(),
      });
      queryClient.removeQueries({
        queryKey: watchlistQueryKeys.detail(key.title),
      });
    },
  });
}
