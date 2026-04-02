export const tvShowQueryKeys = {
  all: ['tv-shows'] as const,
  lists: () => [...tvShowQueryKeys.all, 'list'] as const,
  list: (params?: { bookmark?: string; limit?: number; searchTerm?: string }) =>
    [...tvShowQueryKeys.lists(), params ?? {}] as const,
  details: () => [...tvShowQueryKeys.all, 'detail'] as const,
  detail: (title: string) => [...tvShowQueryKeys.details(), title] as const,
};
