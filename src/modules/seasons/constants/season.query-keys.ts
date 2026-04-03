export const seasonQueryKeys = {
  all: ['seasons'] as const,
  lists: () => [...seasonQueryKeys.all, 'list'] as const,
  list: (params?: { bookmark?: string; limit?: number; searchTerm?: string }) =>
    [...seasonQueryKeys.lists(), params ?? {}] as const,
  details: () => [...seasonQueryKeys.all, 'detail'] as const,
  detail: (tvShowKey: string, number: number) =>
    [...seasonQueryKeys.details(), tvShowKey, number] as const,
};
