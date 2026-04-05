import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock3, History } from 'lucide-react';

import {
  Button,
  Card,
  CardContent,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  Skeleton,
} from '@/components/ui';
import { formatTimestamp } from '@/lib/date';
import { internalApiRequest } from '@/lib/api/internal-api-client';
import type { RawAssetHistoryMeta, ReadAssetHistoryResponse } from '@/shared/types';

interface AssetHistoryPanelProps<TKey> {
  assetBasePath: '/api/tv-shows' | '/api/seasons' | '/api/episodes';
  assetLabel: string;
  historyKey: TKey;
}

const historyItemsPerPage = 10;

function sortHistoryEntries(entries: RawAssetHistoryMeta[]) {
  return [...entries].sort(
    (left, right) =>
      new Date(right._timestamp ?? right['@lastUpdated']).getTime() -
      new Date(left._timestamp ?? left['@lastUpdated']).getTime(),
  );
}

export function AssetHistoryPanel<TKey>({
  assetBasePath,
  assetLabel,
  historyKey,
}: AssetHistoryPanelProps<TKey>) {
  const [currentPage, setCurrentPage] = useState(1);
  const historyQuery = useQuery({
    queryKey: ['asset-history', assetBasePath, historyKey],
    queryFn: ({ signal }) =>
      internalApiRequest<ReadAssetHistoryResponse<RawAssetHistoryMeta>>(
        `${assetBasePath}/history`,
        {
          method: 'POST',
          body: { key: historyKey },
          signal,
        },
      ),
    select: sortHistoryEntries,
  });

  if (historyQuery.isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton
            key={`asset-history-skeleton-${index}`}
            className="h-24 rounded-2xl bg-[#2a2c31]"
          />
        ))}
      </div>
    );
  }

  if (historyQuery.isError) {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5">
        <p className="text-sm font-medium text-rose-200">
          Unable to load asset history.
        </p>
        <p className="mt-2 text-sm text-rose-100/80">
          {historyQuery.error instanceof Error
            ? historyQuery.error.message
            : 'An unexpected error happened while loading the history.'}
        </p>
      </div>
    );
  }

  if (!historyQuery.data?.length) {
    return (
      <Empty className="rounded-2xl border border-white/10 bg-[#1f2126] p-8">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <History />
          </EmptyMedia>
          <EmptyTitle className="text-white">
            No history available
          </EmptyTitle>
          <EmptyDescription className="text-[#d5d0c5]">
            No blockchain events were returned for this {assetLabel.toLowerCase()}
            .
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const totalPages = Math.max(
    1,
    Math.ceil(historyQuery.data.length / historyItemsPerPage),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedEntries = historyQuery.data.slice(
    (safeCurrentPage - 1) * historyItemsPerPage,
    safeCurrentPage * historyItemsPerPage,
  );
  const hasPreviousPage = safeCurrentPage > 1;
  const hasNextPage = safeCurrentPage < totalPages;
  const showCursorEmptyState =
    !paginatedEntries.length && hasPreviousPage && historyQuery.data.length > 0;

  return (
    <div className="space-y-3">
      {showCursorEmptyState ? (
        <div className="rounded-2xl border border-white/10 bg-[#1f2126] p-6 text-center">
          <p className="text-sm font-medium text-white">
            No history events were returned for this page.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Return to the previous page to continue browsing the blockchain
            history.
          </p>
          <div className="mt-5 flex justify-center">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            >
              Return to previous page
            </Button>
          </div>
        </div>
      ) : (
        <div className="max-h-[30rem] space-y-3 overflow-y-auto pr-1">
          {paginatedEntries.map((entry) => (
            <Card
              key={`${entry._txId}-${entry._timestamp}`}
              className="rounded-2xl border border-white/10 bg-[#2a2c31] py-0 shadow-none"
            >
              <CardContent className="space-y-3 px-4 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#d5d0c5]">
                    {entry['@lastTx']}
                  </span>
                  {entry._isDelete ? (
                    <span className="inline-flex rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-rose-200">
                      Delete
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 text-sm text-[#d5d0c5]">
                  <Clock3 className="size-4 text-muted-foreground" />
                  <span>
                    {formatTimestamp(entry._timestamp ?? entry['@lastUpdated'], {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>

                <div className="space-y-1 text-sm text-[#d5d0c5]">
                  <p className="break-all">
                    <span className="text-muted-foreground">
                      Transaction id:
                    </span>{' '}
                    {entry._txId}
                  </p>
                  <p className="break-all">
                    <span className="text-muted-foreground">Asset key:</span>{' '}
                    {entry['@key']}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {historyQuery.data.length > historyItemsPerPage ? (
        <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Page {safeCurrentPage} of {totalPages}.
          </p>
          <Pagination className="mx-0 w-auto justify-start sm:justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#asset-history-pagination"
                  aria-disabled={!hasPreviousPage}
                  className={
                    !hasPreviousPage ? 'pointer-events-none opacity-50' : undefined
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    if (hasPreviousPage) {
                      setCurrentPage((page) => Math.max(1, page - 1));
                    }
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#asset-history-pagination"
                  aria-disabled={!hasNextPage}
                  className={
                    !hasNextPage ? 'pointer-events-none opacity-50' : undefined
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    if (hasNextPage) {
                      setCurrentPage((page) => page + 1);
                    }
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}
    </div>
  );
}
