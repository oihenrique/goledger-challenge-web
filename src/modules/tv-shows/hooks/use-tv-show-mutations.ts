import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tvShowQueryKeys } from '@/modules/tv-shows/constants/tv-show.query-keys';
import {
  createTvShow,
  deleteTvShow,
  updateTvShow,
} from '@/modules/tv-shows/services/tv-show.service';
import type {
  CreateTvShowInput,
  TvShowKey,
  UpdateTvShowInput,
} from '@/modules/tv-shows/types/tv-show.types';

export function useCreateTvShow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTvShowInput) => createTvShow(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: tvShowQueryKeys.lists(),
      });
    },
  });
}

export function useUpdateTvShow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTvShowInput) => updateTvShow(input),
    onSuccess: (tvShow) => {
      void queryClient.invalidateQueries({
        queryKey: tvShowQueryKeys.lists(),
      });
      queryClient.setQueryData(
        tvShowQueryKeys.detail(tvShow.title),
        tvShow,
      );
    },
  });
}

export function useDeleteTvShow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key: TvShowKey) => deleteTvShow(key),
    onSuccess: (_, key) => {
      void queryClient.invalidateQueries({
        queryKey: tvShowQueryKeys.lists(),
      });
      queryClient.removeQueries({
        queryKey: tvShowQueryKeys.detail(key.title),
      });
    },
  });
}
