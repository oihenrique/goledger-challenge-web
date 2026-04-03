import { useQuery } from '@tanstack/react-query';

import { seasonQueryKeys } from '@/modules/seasons/constants/season.query-keys';
import { searchPaginatedSeasons } from '@/modules/seasons/services/season.service';
import type { SearchSeasonsParams } from '@/modules/seasons/types/season.types';

export function useSeasons(params: SearchSeasonsParams) {
  return useQuery({
    queryKey: seasonQueryKeys.list(params),
    queryFn: ({ signal }) => searchPaginatedSeasons(params, signal),
  });
}
