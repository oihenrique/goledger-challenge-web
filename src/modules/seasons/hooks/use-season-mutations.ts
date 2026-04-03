import { useMutation, useQueryClient } from '@tanstack/react-query';

import { seasonQueryKeys } from '@/modules/seasons/constants/season.query-keys';
import {
  createSeason,
  deleteSeason,
  updateSeason,
} from '@/modules/seasons/services/season.service';
import type {
  CreateSeasonInput,
  SeasonKey,
  UpdateSeasonInput,
} from '@/modules/seasons/types/season.types';

export function useCreateSeason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateSeasonInput) => createSeason(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: seasonQueryKeys.lists(),
      });
    },
  });
}

export function useUpdateSeason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateSeasonInput) => updateSeason(input),
    onSuccess: (season) => {
      void queryClient.invalidateQueries({
        queryKey: seasonQueryKeys.lists(),
      });
      queryClient.setQueryData(
        seasonQueryKeys.detail(season.tvShowKey, season.number),
        season,
      );
    },
  });
}

export function useDeleteSeason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key: SeasonKey) => deleteSeason(key),
    onSuccess: (_, key) => {
      void queryClient.invalidateQueries({
        queryKey: seasonQueryKeys.lists(),
      });
      queryClient.removeQueries({
        queryKey: seasonQueryKeys.detail(key.tvShow['@key'], key.number),
      });
    },
  });
}
