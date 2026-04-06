import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

import { SearchInputGroup } from '@/components/shared/search-input-group';
import { TvShowDeleteDialog } from '@/components/tv-shows/tv-show-delete-dialog';
import { TvShowFormModal } from '@/components/tv-shows/tv-show-form-modal';
import { Button } from '@/components/ui';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui';
import { TvShowManagementTable } from '@/components/tv-shows/tv-show-management-table';
import { PageShell } from '@/layout/page-shell';
import { InternalApiError } from '@/lib/api/internal-api-client';
import {
  useCreateTvShow,
  useDeleteTvShow,
  useUpdateTvShow,
} from '@/modules/tv-shows/hooks/use-tv-show-mutations';
import { useTvShows } from '@/modules/tv-shows/hooks/use-tv-shows';
import type {
  CreateTvShowInput,
  TvShowViewModel,
  UpdateTvShowInput,
} from '@/modules/tv-shows/types/tv-show.types';

const tvShowsPerPage = 10;

function getMutationErrorMessage(error: unknown, fallback: string) {
  if (error instanceof InternalApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function ManageTvShowsPage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState('');
  const [currentBookmark, setCurrentBookmark] = useState<string | undefined>();
  const [previousBookmarks, setPreviousBookmarks] = useState<
    Array<string | undefined>
  >([]);
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null);
  const [selectedTvShow, setSelectedTvShow] = useState<TvShowViewModel | null>(
    null,
  );
  const [tvShowPendingDeletion, setTvShowPendingDeletion] =
    useState<TvShowViewModel | null>(null);
  const { data, isLoading, isError, error } = useTvShows({
    limit: tvShowsPerPage,
    bookmark: currentBookmark,
    searchTerm: submittedSearchTerm || undefined,
  });
  const createMutation = useCreateTvShow();
  const updateMutation = useUpdateTvShow();
  const deleteMutation = useDeleteTvShow();
  const tvShows = data?.items ?? [];
  const currentPage = previousBookmarks.length + 1;
  const hasPreviousPage = previousBookmarks.length > 0;
  const hasNextPage = Boolean(data?.bookmark);
  const showEmptyState =
    !isLoading && !isError && tvShows.length === 0 && !hasPreviousPage;
  const showCursorEmptyState =
    !isLoading && !isError && tvShows.length === 0 && hasPreviousPage;

  function openCreateModal() {
    setSelectedTvShow(null);
    setFormMode('create');
  }

  function openEditModal(tvShow: TvShowViewModel) {
    setSelectedTvShow(tvShow);
    setFormMode('edit');
  }

  function closeFormModal() {
    setFormMode(null);
    setSelectedTvShow(null);
  }

  function handleCreateSuccessNavigate(title: string) {
    closeFormModal();
    void router.push(`/manage/tv-shows/${encodeURIComponent(title)}`);
  }

  function openDeleteDialog(tvShow: TvShowViewModel) {
    setTvShowPendingDeletion(tvShow);
  }

  function closeDeleteDialog() {
    setTvShowPendingDeletion(null);
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
    input: CreateTvShowInput | UpdateTvShowInput,
  ) {
    try {
      if (formMode === 'edit') {
        await updateMutation.mutateAsync(input);
        toast.success(`Updated ${input.title} in the editorial catalog.`);
      } else {
        await createMutation.mutateAsync(input);
        toast.success(`Created ${input.title} in the editorial catalog.`);
      }

      closeFormModal();
    } catch (mutationError) {
      toast.error(
        getMutationErrorMessage(
          mutationError,
          formMode === 'edit'
            ? 'Unable to update this TV show.'
            : 'Unable to create this TV show.',
        ),
      );
    }
  }

  async function handleDeleteConfirm() {
    if (!tvShowPendingDeletion) {
      return;
    }

    try {
      await deleteMutation.mutateAsync({
        '@assetType': 'tvShows',
        title: tvShowPendingDeletion.title,
      });
      toast.success(`Deleted ${tvShowPendingDeletion.title} from the catalog.`);
      closeDeleteDialog();
    } catch (mutationError) {
      toast.error(
        getMutationErrorMessage(
          mutationError,
          'Unable to delete this TV show.',
        ),
      );
    }
  }

  const isFormPending = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <PageShell>
        <section
          className="space-y-6 py-6 sm:space-y-8 sm:py-16"
          aria-busy={isLoading}
          aria-live="polite"
        >
          <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3 sm:space-y-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground sm:text-xs sm:tracking-[0.28em]">
                Editorial workspace
              </p>
              <h1 className="max-w-3xl text-2xl font-semibold tracking-tight text-white sm:text-5xl">
                Manage TV shows
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-[#d5d0c5] sm:text-base sm:leading-8">
                Manage the TV shows registered in our catalog. Navigate through
                our collection, and click on a TV show to edit its details or
                delete it from the catalog.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
              <Button variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/tv-shows">Open public catalog</Link>
              </Button>
              <Button className="w-full sm:w-auto" onClick={openCreateModal}>
                Create TV show
              </Button>
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-white/10 bg-card p-3 sm:rounded-3xl sm:p-5">
            <SearchInputGroup
              id="manage-tv-show-search"
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
              aria-label="Loading TV show management data"
              className="h-48 rounded-[1.25rem] border border-white/10 bg-card sm:h-80 sm:rounded-3xl"
            />
          ) : null}

          {isError ? (
            <div
              role="alert"
              className="rounded-[1.25rem] border border-rose-500/30 bg-rose-950/20 p-4 sm:rounded-3xl sm:p-6"
            >
              <p className="text-sm font-medium text-rose-200">
                Unable to load TV show management data.
              </p>
              <p className="mt-2 text-sm text-rose-100/80">
                {error instanceof Error
                  ? error.message
                  : 'An unexpected error happened while loading the workspace.'}
              </p>
            </div>
          ) : null}

          {showEmptyState ? (
            <div
              role="status"
              className="rounded-[1.25rem] border border-white/10 bg-card p-6 text-center sm:rounded-3xl sm:p-10"
            >
              <p className="text-base font-medium text-white sm:text-lg">
                No TV shows matched this workspace filter.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Try a different term or clear the filter to see every registered
                series.
              </p>
            </div>
          ) : null}

          {showCursorEmptyState ? (
            <div className="space-y-5 sm:space-y-6">
              <div className="rounded-[1.25rem] border border-white/10 bg-card p-6 text-center sm:rounded-3xl sm:p-10">
                <p className="text-base font-medium text-white sm:text-lg">
                  No more TV shows were returned for this page cursor.
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Go back to the previous page or adjust the workspace filter.
                </p>
                <div className="mt-5 flex justify-center sm:mt-6">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={handlePreviousPage}
                  >
                    Return to previous page
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Batch {currentPage}. No results.
                </p>
                <Pagination className="mx-0 w-full justify-start sm:w-auto sm:justify-end">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#tv-shows-management-pagination"
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
                        href="#tv-shows-management-pagination"
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

          {!isLoading && !isError && tvShows.length > 0 ? (
            <div className="space-y-6">
              <TvShowManagementTable
                tvShows={tvShows}
                onEdit={openEditModal}
                onDelete={openDeleteDialog}
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Batch {currentPage}. Showing up to {tvShowsPerPage} titles per
                  workspace request.
                </p>
                <Pagination className="mx-0 w-full justify-start sm:w-auto sm:justify-end">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#tv-shows-management-pagination"
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
                        href="#tv-shows-management-pagination"
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
        <TvShowFormModal
          key={`${formMode}-${selectedTvShow?.key ?? 'new'}`}
          mode={formMode}
          tvShow={selectedTvShow}
          isPending={isFormPending}
          onCreateSuccessNavigate={handleCreateSuccessNavigate}
          onClose={closeFormModal}
          onSubmit={handleFormSubmit}
        />
      ) : null}

      {tvShowPendingDeletion ? (
        <TvShowDeleteDialog
          tvShow={tvShowPendingDeletion}
          isPending={deleteMutation.isPending}
          onClose={closeDeleteDialog}
          onConfirm={handleDeleteConfirm}
        />
      ) : null}
    </>
  );
}
