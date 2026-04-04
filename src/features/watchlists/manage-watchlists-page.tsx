import { useState } from 'react';
import { toast } from 'sonner';

import { SearchInputGroup } from '@/components/shared/search-input-group';
import { WatchlistDeleteDialog } from '@/components/watchlists/watchlist-delete-dialog';
import { WatchlistFormModal } from '@/components/watchlists/watchlist-form-modal';
import { WatchlistManagementTable } from '@/components/watchlists/watchlist-management-table';
import {
  Button,
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
} from '@/components/ui';
import { PageShell } from '@/layout/page-shell';
import { InternalApiError } from '@/lib/api/internal-api-client';
import {
  useCreateWatchlist,
  useDeleteWatchlist,
  useUpdateWatchlist,
} from '@/modules/watchlists/hooks/use-watchlist-mutations';
import { useWatchlists } from '@/modules/watchlists/hooks/use-watchlists';
import type {
  CreateWatchlistInput,
  SearchWatchlistsParams,
  UpdateWatchlistInput,
  WatchlistViewModel,
} from '@/modules/watchlists/types/watchlist.types';
import { BookmarkPlus } from 'lucide-react';

const watchlistsPerPage = 10;

function getMutationErrorMessage(error: unknown, fallback: string) {
  if (error instanceof InternalApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function ManageWatchlistsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState('');
  const [currentBookmark, setCurrentBookmark] = useState<string | undefined>();
  const [previousBookmarks, setPreviousBookmarks] = useState<
    Array<string | undefined>
  >([]);
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null);
  const [selectedWatchlist, setSelectedWatchlist] =
    useState<WatchlistViewModel | null>(null);
  const [watchlistPendingDeletion, setWatchlistPendingDeletion] =
    useState<WatchlistViewModel | null>(null);

  const watchlistsQueryParams: SearchWatchlistsParams = {
    bookmark: currentBookmark,
    limit: watchlistsPerPage,
    searchTerm: submittedSearchTerm || undefined,
  };
  const { data, isLoading, isError, error } = useWatchlists(
    watchlistsQueryParams,
  );
  const createMutation = useCreateWatchlist();
  const updateMutation = useUpdateWatchlist();
  const deleteMutation = useDeleteWatchlist();
  const watchlists = data?.items ?? [];
  const currentPage = previousBookmarks.length + 1;
  const hasPreviousPage = previousBookmarks.length > 0;
  const hasNextPage = Boolean(data?.bookmark);
  const showEmptyState =
    !isLoading && !isError && watchlists.length === 0 && !hasPreviousPage;
  const showCursorEmptyState =
    !isLoading && !isError && watchlists.length === 0 && hasPreviousPage;

  function openCreateModal() {
    setSelectedWatchlist(null);
    setFormMode('create');
  }

  function openEditModal(watchlist: WatchlistViewModel) {
    setSelectedWatchlist(watchlist);
    setFormMode('edit');
  }

  function closeFormModal() {
    setFormMode(null);
    setSelectedWatchlist(null);
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedSearchTerm(searchInput.trim());
    setCurrentBookmark(undefined);
    setPreviousBookmarks([]);
  }

  function handleClearSearch() {
    setSearchInput('');
    setSubmittedSearchTerm('');
    setCurrentBookmark(undefined);
    setPreviousBookmarks([]);
  }

  function handleNextPage() {
    if (!data?.bookmark) {
      return;
    }

    setPreviousBookmarks((previous) => [...previous, currentBookmark]);
    setCurrentBookmark(data.bookmark);
  }

  function handlePreviousPage() {
    setPreviousBookmarks((previous) => {
      const nextPrevious = [...previous];
      const previousBookmark = nextPrevious.pop();
      setCurrentBookmark(previousBookmark);
      return nextPrevious;
    });
  }

  async function handleFormSubmit(
    input: CreateWatchlistInput | UpdateWatchlistInput,
  ) {
    try {
      if (formMode === 'edit') {
        await updateMutation.mutateAsync(input);
        toast.success(`Updated ${input.title}.`);
      } else {
        await createMutation.mutateAsync(input);
        toast.success(`Created ${input.title}.`);
      }

      closeFormModal();
    } catch (mutationError) {
      toast.error(
        getMutationErrorMessage(
          mutationError,
          formMode === 'edit'
            ? 'Unable to update this watchlist.'
            : 'Unable to create this watchlist.',
        ),
      );
    }
  }

  async function handleDeleteConfirm() {
    if (!watchlistPendingDeletion) {
      return;
    }

    try {
      await deleteMutation.mutateAsync({
        '@assetType': 'watchlist',
        title: watchlistPendingDeletion.title,
      });
      toast.success(`Deleted ${watchlistPendingDeletion.title}.`);
      setWatchlistPendingDeletion(null);
    } catch (mutationError) {
      toast.error(
        getMutationErrorMessage(
          mutationError,
          'Unable to delete this watchlist.',
        ),
      );
    }
  }

  const isFormPending = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <PageShell>
        <section
          className="space-y-8 py-14 sm:py-16"
          aria-busy={isLoading}
          aria-live="polite"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Manage watchlists
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[#d5d0c5]">
                Create watchlists here, then open each one to add or remove TV
                show items.
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={openCreateModal}>Create watchlist</Button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-card p-4 sm:p-5">
            <SearchInputGroup
              id="manage-watchlist-search"
              label="Search"
              value={searchInput}
              placeholder="Filter by title or description"
              onChange={setSearchInput}
              onClear={handleClearSearch}
              onSubmit={handleSearchSubmit}
            />
          </div>

          {isLoading ? (
            <div
              role="status"
              aria-label="Loading watchlists"
              className="h-80 rounded-3xl border border-white/10 bg-card"
            />
          ) : null}

          {isError ? (
            <div
              role="alert"
              className="rounded-3xl border border-rose-500/30 bg-rose-950/20 p-6"
            >
              <p className="text-sm font-medium text-rose-200">
                Unable to load watchlists.
              </p>
              <p className="mt-2 text-sm text-rose-100/80">
                {error instanceof Error
                  ? error.message
                  : 'An unexpected error happened while loading the watchlists.'}
              </p>
            </div>
          ) : null}

          {showEmptyState ? (
            <Empty
              role="status"
              className="rounded-3xl border border-dashed border-white/10 bg-card p-10"
            >
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <BookmarkPlus />
                </EmptyMedia>
                <EmptyTitle className="text-white">
                  No watchlists available
                </EmptyTitle>
                <EmptyDescription className="text-[#d5d0c5]">
                  Create the first watchlist to start grouping TV shows for
                  later viewing.
                </EmptyDescription>
              </EmptyHeader>
              <Button onClick={openCreateModal}>Create watchlist</Button>
            </Empty>
          ) : null}

          {showCursorEmptyState ? (
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-card p-10 text-center">
                <p className="text-lg font-medium text-white">
                  No more watchlists were returned for this cursor position.
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  You can return to the previous page without losing your
                  current filters.
                </p>
                <div className="mt-6 flex justify-center">
                  <Button variant="outline" onClick={handlePreviousPage}>
                    Return to previous page
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage}. No results.
                </p>
                <Pagination className="mx-0 w-auto justify-start sm:justify-end">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#watchlists-pagination"
                        aria-disabled={!hasPreviousPage}
                        className={
                          !hasPreviousPage
                            ? 'pointer-events-none opacity-50'
                            : undefined
                        }
                        onClick={(event) => {
                          event.preventDefault();
                          handlePreviousPage();
                        }}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        href="#watchlists-pagination"
                        aria-disabled
                        className="pointer-events-none opacity-50"
                        onClick={(event) => {
                          event.preventDefault();
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          ) : null}

          {!isLoading && !isError && watchlists.length > 0 ? (
            <div className="space-y-8">
              <WatchlistManagementTable
                watchlists={watchlists}
                onEdit={openEditModal}
                onDelete={setWatchlistPendingDeletion}
              />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage}. Showing up to {watchlistsPerPage}{' '}
                  watchlists per request.
                </p>
                <Pagination className="mx-0 w-auto justify-start sm:justify-end">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#watchlists-pagination"
                        aria-disabled={!hasPreviousPage}
                        className={
                          !hasPreviousPage
                            ? 'pointer-events-none opacity-50'
                            : undefined
                        }
                        onClick={(event) => {
                          event.preventDefault();
                          handlePreviousPage();
                        }}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        href="#watchlists-pagination"
                        aria-disabled={!hasNextPage}
                        className={
                          !hasNextPage
                            ? 'pointer-events-none opacity-50'
                            : undefined
                        }
                        onClick={(event) => {
                          event.preventDefault();
                          handleNextPage();
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          ) : null}
        </section>
      </PageShell>

      {formMode ? (
        <WatchlistFormModal
          isPending={isFormPending}
          mode={formMode}
          onClose={closeFormModal}
          onSubmit={handleFormSubmit}
          watchlist={selectedWatchlist}
        />
      ) : null}

      {watchlistPendingDeletion ? (
        <WatchlistDeleteDialog
          isPending={deleteMutation.isPending}
          onClose={() => setWatchlistPendingDeletion(null)}
          onConfirm={handleDeleteConfirm}
          watchlist={watchlistPendingDeletion}
        />
      ) : null}
    </>
  );
}
