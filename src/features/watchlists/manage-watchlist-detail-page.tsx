import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
  BookmarkPlus,
  Check,
  ChevronLeft,
  LoaderCircle,
  Search,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

import { AppImage } from '@/components/shared/app-image';
import { SearchInputGroup } from '@/components/shared/search-input-group';
import { WatchlistDeleteDialog } from '@/components/watchlists/watchlist-delete-dialog';
import { WatchlistDetailsModal } from '@/components/watchlists/watchlist-details-modal';
import { WatchlistFormModal } from '@/components/watchlists/watchlist-form-modal';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { useTvShows } from '@/modules/tv-shows/hooks/use-tv-shows';
import type { TvShowViewModel } from '@/modules/tv-shows/types/tv-show.types';
import {
  useDeleteWatchlist,
  useUpdateWatchlist,
} from '@/modules/watchlists/hooks/use-watchlist-mutations';
import { useWatchlist } from '@/modules/watchlists/hooks/use-watchlist';
import type { UpdateWatchlistInput } from '@/modules/watchlists/types/watchlist.types';
import {
  buildWatchlistTvShowReferences,
  getWatchlistTvShows,
} from '@/modules/watchlists/utils/watchlist-relations';

interface ManageWatchlistDetailPageProps {
  title: string;
}

const watchlistItemsPerPage = 10;

function getMutationErrorMessage(error: unknown, fallback: string) {
  if (error instanceof InternalApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function ManageWatchlistDetailPage({
  title,
}: ManageWatchlistDetailPageProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState('');
  const [selectedSearchResultKey, setSelectedSearchResultKey] = useState<
    string | null
  >(null);
  const [currentItemsPage, setCurrentItemsPage] = useState(1);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const watchlistQuery = useWatchlist({
    '@assetType': 'watchlist',
    title,
  });
  const allTvShowsQuery = useTvShows({});
  const updateMutation = useUpdateWatchlist();
  const deleteMutation = useDeleteWatchlist();

  const watchlist = watchlistQuery.data ?? null;
  const linkedTvShows = getWatchlistTvShows(
    watchlist,
    allTvShowsQuery.data?.items ?? [],
  );
  const totalItemsPages = Math.max(
    1,
    Math.ceil(linkedTvShows.length / watchlistItemsPerPage),
  );
  const safeCurrentItemsPage = Math.min(currentItemsPage, totalItemsPages);
  const paginatedLinkedTvShows = linkedTvShows.slice(
    (safeCurrentItemsPage - 1) * watchlistItemsPerPage,
    safeCurrentItemsPage * watchlistItemsPerPage,
  );
  const hasPreviousItemsPage = safeCurrentItemsPage > 1;
  const hasNextItemsPage = safeCurrentItemsPage < totalItemsPages;

  const selectableResults = useMemo(() => {
    if (!submittedSearchTerm) {
      return [];
    }

    const normalizedSearchTerm = submittedSearchTerm.toLowerCase();
    const existingTvShowKeys = new Set(watchlist?.tvShowKeys ?? []);

    return (allTvShowsQuery.data?.items ?? []).filter((tvShow) => {
      if (existingTvShowKeys.has(tvShow.key)) {
        return false;
      }

      return (
        tvShow.title.toLowerCase().includes(normalizedSearchTerm) ||
        tvShow.description.toLowerCase().includes(normalizedSearchTerm)
      );
    });
  }, [allTvShowsQuery.data?.items, submittedSearchTerm, watchlist?.tvShowKeys]);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedSearchTerm(searchInput.trim());
    setSelectedSearchResultKey(null);
  }

  function handleClearSearch() {
    setSearchInput('');
    setSubmittedSearchTerm('');
    setSelectedSearchResultKey(null);
  }

  function toggleSelectedTvShow(tvShowKey: string) {
    setSelectedSearchResultKey((previous) =>
      previous === tvShowKey ? null : tvShowKey,
    );
  }

  async function updateWatchlistTvShows(nextTvShowKeys: string[]) {
    if (!watchlist) {
      return;
    }

    const payload: UpdateWatchlistInput = {
      '@assetType': 'watchlist',
      description: watchlist.description,
      title: watchlist.title,
      tvShows: buildWatchlistTvShowReferences(nextTvShowKeys),
    };

    await updateMutation.mutateAsync(payload);
  }

  async function handleConfirmSelection() {
    if (!watchlist || !selectedSearchResultKey) {
      return;
    }

    try {
      const nextKeys = Array.from(
        new Set([...watchlist.tvShowKeys, selectedSearchResultKey]),
      );
      await updateWatchlistTvShows(nextKeys);
      setSelectedSearchResultKey(null);
      setCurrentItemsPage(1);
      toast.success('Added the selected TV show to this watchlist.');
    } catch (mutationError) {
      toast.error(
        getMutationErrorMessage(
          mutationError,
          'Unable to add TV shows to this watchlist.',
        ),
      );
    }
  }

  async function handleRemoveTvShow(tvShow: TvShowViewModel) {
    if (!watchlist) {
      return;
    }

    try {
      const nextKeys = watchlist.tvShowKeys.filter((key) => key !== tvShow.key);
      await updateWatchlistTvShows(nextKeys);
      if (safeCurrentItemsPage > 1 && paginatedLinkedTvShows.length === 1) {
        setCurrentItemsPage((page) => Math.max(1, page - 1));
      }
      toast.success(`Removed ${tvShow.title} from this watchlist.`);
    } catch (mutationError) {
      toast.error(
        getMutationErrorMessage(
          mutationError,
          'Unable to remove this TV show from the watchlist.',
        ),
      );
    }
  }

  async function handleWatchlistSubmit(input: UpdateWatchlistInput) {
    if (!watchlist) {
      return;
    }

    try {
      const updatedWatchlist = await updateMutation.mutateAsync({
        ...input,
        tvShows: buildWatchlistTvShowReferences(watchlist.tvShowKeys),
      });
      setIsEditModalOpen(false);
      toast.success(`Updated ${updatedWatchlist.title}.`);

      if (updatedWatchlist.title !== title) {
        void router.replace(
          `/manage/watchlists/${encodeURIComponent(updatedWatchlist.title)}`,
        );
      }
    } catch (mutationError) {
      toast.error(
        getMutationErrorMessage(
          mutationError,
          'Unable to update this watchlist.',
        ),
      );
    }
  }

  async function handleDeleteConfirm() {
    if (!watchlist) {
      return;
    }

    try {
      await deleteMutation.mutateAsync({
        '@assetType': 'watchlist',
        title: watchlist.title,
      });
      toast.success(`Deleted ${watchlist.title}.`);
      void router.push('/manage/watchlists');
    } catch (mutationError) {
      toast.error(
        getMutationErrorMessage(
          mutationError,
          'Unable to delete this watchlist.',
        ),
      );
    }
  }

  function handleNextItemsPage() {
    if (!hasNextItemsPage) {
      return;
    }

    setCurrentItemsPage((page) => page + 1);
  }

  function handlePreviousItemsPage() {
    if (!hasPreviousItemsPage) {
      return;
    }

    setCurrentItemsPage((page) => Math.max(1, page - 1));
  }

  return (
    <>
      <PageShell>
        <section
          className="space-y-8 py-14 sm:py-16"
          aria-busy={watchlistQuery.isLoading}
          aria-live="polite"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/manage/watchlists">
                <ChevronLeft className="size-4" />
                <span>Back to watchlists</span>
              </Link>
            </Button>
          </div>

          {watchlistQuery.isLoading ? (
            <div
              role="status"
              aria-label="Loading watchlist"
              className="space-y-6"
            >
              <div className="h-16 w-1/2 rounded-3xl border border-white/10 bg-card" />
              <div className="h-120 rounded-3xl border border-white/10 bg-card" />
            </div>
          ) : null}

          {watchlistQuery.isError ? (
            <div
              role="alert"
              className="rounded-3xl border border-rose-500/30 bg-rose-950/20 p-6"
            >
              <p className="text-sm font-medium text-rose-200">
                Unable to load this watchlist.
              </p>
              <p className="mt-2 text-sm text-rose-100/80">
                {watchlistQuery.error instanceof Error
                  ? watchlistQuery.error.message
                  : 'An unexpected error happened while loading the watchlist.'}
              </p>
            </div>
          ) : null}

          {!watchlistQuery.isLoading && !watchlistQuery.isError && watchlist ? (
            <>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-4">
                  <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    {watchlist.title}
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-[#d5d0c5]">
                    {watchlist.description ||
                      'This watchlist does not have a description yet.'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailsModalOpen(true)}
                  >
                    Technical details
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Edit watchlist
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    Delete watchlist
                  </Button>
                </div>
              </div>

              <div className="grid gap-6">
                <Card className="rounded-3xl border border-white/10 bg-card py-0 shadow-none">
                  <CardHeader className="border-b border-white/10 px-6 py-5">
                    <div className="space-y-2">
                      <CardTitle className="text-xl font-semibold text-white">
                        Add a title to this list
                      </CardTitle>
                      <p className="text-sm leading-7 text-[#d5d0c5]">
                        Search for catalog titles, select one or more results,
                        then confirm the additions.
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 px-6 pb-6">
                    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-end">
                      <div className="flex-1">
                        <SearchInputGroup
                          id="watchlist-tv-show-search"
                          label="Search title to add"
                          value={searchInput}
                          placeholder="Search title to add"
                          onChange={setSearchInput}
                          onClear={handleClearSearch}
                          onSubmit={handleSearchSubmit}
                        />
                      </div>
                      <div className="sm:pb-1">
                        <Button
                          type="button"
                          disabled={
                            !selectedSearchResultKey || updateMutation.isPending
                          }
                          onClick={() => void handleConfirmSelection()}
                        >
                          {updateMutation.isPending ? (
                            <LoaderCircle className="size-4 animate-spin" />
                          ) : (
                            <Check className="size-4" />
                          )}
                          <span>Confirm</span>
                        </Button>
                      </div>
                    </div>

                    {submittedSearchTerm ? (
                      allTvShowsQuery.isLoading ? (
                        <div
                          role="status"
                          aria-label="Searching TV shows"
                          className="h-56 rounded-2xl border border-white/10 bg-[#2a2c31]"
                        />
                      ) : selectableResults.length > 0 ? (
                        <div className="space-y-3">
                          {selectableResults.map((tvShow) => {
                            const isSelected =
                              selectedSearchResultKey === tvShow.key;

                            return (
                              <button
                                type="button"
                                key={tvShow.key}
                                aria-pressed={isSelected}
                                aria-label={`Select ${tvShow.title} to add to ${watchlist.title}`}
                                className={`flex w-full cursor-pointer items-start gap-3 rounded-2xl border px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                                  isSelected
                                    ? 'border-[#7c6135] bg-[#2a2c31]'
                                    : 'border-white/10 bg-[#1c1d21] hover:bg-[#23252a]'
                                }`}
                                onClick={() => toggleSelectedTvShow(tvShow.key)}
                              >
                                <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#25272c]">
                                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(66,92,144,0.2),rgba(15,23,42,0.94))]" />
                                </div>
                                <div className="min-w-0 flex-1 space-y-2">
                                  <div className="flex items-center justify-between gap-3">
                                    <p className="font-medium text-white">
                                      {tvShow.title}
                                    </p>
                                    <span className="text-xs text-muted-foreground">
                                      {tvShow.recommendedAge}+
                                    </span>
                                  </div>
                                  <p
                                    className="truncate text-sm leading-6 text-[#d5d0c5]"
                                    title={tvShow.description}
                                  >
                                    {tvShow.description}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : allTvShowsQuery.isError ? (
                        <div
                          role="alert"
                          className="rounded-2xl border border-rose-500/20 bg-rose-950/20 px-4 py-4"
                        >
                          <p className="text-sm font-medium text-rose-200">
                            Unable to search TV shows.
                          </p>
                        </div>
                      ) : (
                        <Empty className="rounded-2xl border border-dashed border-white/10 bg-[#1c1d21] p-8">
                          <EmptyHeader>
                            <EmptyMedia variant="icon">
                              <Search />
                            </EmptyMedia>
                            <EmptyTitle className="text-white">
                              No matching TV shows
                            </EmptyTitle>
                            <EmptyDescription className="text-[#d5d0c5]">
                              Try another search term to find titles for this
                              watchlist.
                            </EmptyDescription>
                          </EmptyHeader>
                        </Empty>
                      )
                    ) : null}
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border border-white/10 bg-card py-0 shadow-none">
                  <CardHeader className="border-b border-white/10 px-6 py-5">
                    <div className="space-y-2">
                      <CardTitle className="text-xl font-semibold text-white">
                        {watchlist.tvShowKeys.length}{' '}
                        {watchlist.tvShowKeys.length === 1 ? 'title' : 'titles'}
                      </CardTitle>
                      <p className="text-sm leading-7 text-[#d5d0c5]">
                        Keep this list curated by removing titles that no longer
                        belong here.
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 py-6">
                    {allTvShowsQuery.isLoading ? (
                      <div className="h-56 rounded-2xl border border-white/10 bg-[#2a2c31]" />
                    ) : linkedTvShows.length > 0 ? (
                      <div className="space-y-5">
                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1f2126]">
                          <ul className="divide-y divide-white/10">
                            {paginatedLinkedTvShows.map((tvShow, index) => (
                              <li
                                key={tvShow.key}
                                className="px-4 py-4 sm:px-5"
                              >
                                <div className="flex items-start gap-4">
                                  <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#25272c]">
                                    {tvShow.coverImageUrl ? (
                                      <AppImage
                                        src={tvShow.coverImageUrl}
                                        alt={`${tvShow.title} cover`}
                                        fill
                                        sizes="80px"
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(66,92,144,0.2),rgba(15,23,42,0.94))]" />
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1 space-y-3">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                      <div className="min-w-0">
                                        <p className="truncate text-2xl font-semibold text-white">
                                          {(safeCurrentItemsPage - 1) *
                                            watchlistItemsPerPage +
                                            index +
                                            1}
                                          . {tvShow.title}
                                        </p>
                                        <p className="text-sm text-[#d5d0c5]">
                                          Recommended age{' '}
                                          {tvShow.recommendedAge}+
                                        </p>
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          void handleRemoveTvShow(tvShow)
                                        }
                                      >
                                        <Trash2 className="size-4" />
                                        <span>Remove</span>
                                      </Button>
                                    </div>

                                    <p
                                      className="line-clamp-2 text-sm leading-7 text-muted-foreground"
                                      title={tvShow.description}
                                    >
                                      {tvShow.description}
                                    </p>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {totalItemsPages > 1 ? (
                          <div className="space-y-3">
                            <p className="text-center text-sm text-muted-foreground">
                              Page {safeCurrentItemsPage} of {totalItemsPages}.
                            </p>
                            <Pagination>
                              <PaginationContent>
                                <PaginationItem>
                                  <PaginationPrevious
                                    href="#"
                                    onClick={(event) => {
                                      event.preventDefault();
                                      handlePreviousItemsPage();
                                    }}
                                    aria-disabled={!hasPreviousItemsPage}
                                    className={
                                      !hasPreviousItemsPage
                                        ? 'pointer-events-none opacity-50'
                                        : undefined
                                    }
                                  />
                                </PaginationItem>
                                <PaginationItem>
                                  <PaginationNext
                                    href="#"
                                    onClick={(event) => {
                                      event.preventDefault();
                                      handleNextItemsPage();
                                    }}
                                    aria-disabled={!hasNextItemsPage}
                                    className={
                                      !hasNextItemsPage
                                        ? 'pointer-events-none opacity-50'
                                        : undefined
                                    }
                                  />
                                </PaginationItem>
                              </PaginationContent>
                            </Pagination>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <Empty className="rounded-2xl border border-dashed border-white/10 bg-[#1c1d21] p-10">
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <BookmarkPlus />
                          </EmptyMedia>
                          <EmptyTitle className="text-white">
                            No TV shows added yet
                          </EmptyTitle>
                          <EmptyDescription className="text-[#d5d0c5]">
                            Search above and confirm the titles you want to keep
                            in this watchlist.
                          </EmptyDescription>
                        </EmptyHeader>
                      </Empty>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          ) : null}
        </section>
      </PageShell>

      {watchlist && isEditModalOpen ? (
        <WatchlistFormModal
          isPending={updateMutation.isPending}
          mode="edit"
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleWatchlistSubmit}
          watchlist={watchlist}
        />
      ) : null}

      {watchlist && isDetailsModalOpen ? (
        <WatchlistDetailsModal
          watchlist={watchlist}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      ) : null}

      {watchlist && isDeleteDialogOpen ? (
        <WatchlistDeleteDialog
          isPending={deleteMutation.isPending}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          watchlist={watchlist}
        />
      ) : null}
    </>
  );
}
