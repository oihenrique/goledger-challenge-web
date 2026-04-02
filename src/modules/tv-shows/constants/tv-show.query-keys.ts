export const tvShowQueryKeys = {
  all: ['tv-shows'] as const,
  lists: () => [...tvShowQueryKeys.all, 'list'] as const,
  list: () => [...tvShowQueryKeys.lists(), 'all'] as const,
  details: () => [...tvShowQueryKeys.all, 'detail'] as const,
  detail: (title: string) => [...tvShowQueryKeys.details(), title] as const,
};
