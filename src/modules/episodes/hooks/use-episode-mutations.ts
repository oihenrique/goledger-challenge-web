import { useMutation, useQueryClient } from '@tanstack/react-query';

import { episodeQueryKeys } from '@/modules/episodes/constants/episode.query-keys';
import {
  createEpisode,
  deleteEpisode,
  updateEpisode,
} from '@/modules/episodes/services/episode.service';
import type {
  CreateEpisodeInput,
  EpisodeKey,
  UpdateEpisodeInput,
} from '@/modules/episodes/types/episode.types';

export function useCreateEpisode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEpisodeInput) => createEpisode(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: episodeQueryKeys.lists(),
      });
    },
  });
}

export function useUpdateEpisode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateEpisodeInput) => updateEpisode(input),
    onSuccess: (episode) => {
      void queryClient.invalidateQueries({
        queryKey: episodeQueryKeys.lists(),
      });
      queryClient.setQueryData(
        episodeQueryKeys.detail(episode.seasonKey, episode.episodeNumber),
        episode,
      );
    },
  });
}

export function useDeleteEpisode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key: EpisodeKey) => deleteEpisode(key),
    onSuccess: (_, key) => {
      void queryClient.invalidateQueries({
        queryKey: episodeQueryKeys.lists(),
      });
      queryClient.removeQueries({
        queryKey: episodeQueryKeys.detail(key.season['@key'], key.episodeNumber),
      });
    },
  });
}
