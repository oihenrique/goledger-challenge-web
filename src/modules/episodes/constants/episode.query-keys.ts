export const episodeQueryKeys = {
  all: ['episodes'] as const,
  lists: () => [...episodeQueryKeys.all, 'list'] as const,
  list: (params?: { bookmark?: string; limit?: number; searchTerm?: string }) =>
    [...episodeQueryKeys.lists(), params ?? {}] as const,
  details: () => [...episodeQueryKeys.all, 'detail'] as const,
  detail: (seasonKey: string, episodeNumber: number) =>
    [...episodeQueryKeys.details(), seasonKey, episodeNumber] as const,
};
