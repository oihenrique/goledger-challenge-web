export const watchlistQueryKeys = {
  all: ['watchlists'] as const,
  lists: () => [...watchlistQueryKeys.all, 'list'] as const,
  list: (params?: {
    bookmark?: string;
    limit?: number;
    searchTerm?: string;
  }) => [...watchlistQueryKeys.lists(), params ?? {}] as const,
  details: () => [...watchlistQueryKeys.all, 'detail'] as const,
  detail: (title: string) => [...watchlistQueryKeys.details(), title] as const,
};
