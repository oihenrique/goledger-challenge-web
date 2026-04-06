import Link from 'next/link';
import { useState } from 'react';

import { SearchInputGroup } from '@/components/shared/search-input-group';
import {
  Button,
  Card,
  CardContent,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  Skeleton,
} from '@/components/ui';
import { TvShowCatalogCard } from '@/components/tv-shows/tv-show-catalog-card';
import { PageShell } from '@/layout/page-shell';
import { useTvShows } from '@/modules/tv-shows/hooks/use-tv-shows';

const tvShowsPerPage = 12;

export function PublicTvShowsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState('');
  const [currentBookmark, setCurrentBookmark] = useState<string | undefined>();
  const [previousBookmarks, setPreviousBookmarks] = useState<
    Array<string | undefined>
  >([]);

  const { data, isLoading, isError, error } = useTvShows({
    limit: tvShowsPerPage,
    bookmark: currentBookmark,
    searchTerm: submittedSearchTerm || undefined,
  });

  const items = data?.items ?? [];
  const currentPage = previousBookmarks.length + 1;
  const hasNextPage = Boolean(data?.bookmark);
  const hasPreviousPage = previousBookmarks.length > 0;

  const showEmptyState =
    !isLoading && !isError && items.length === 0 && !hasPreviousPage;

  const showCursorEmptyState =
    !isLoading && !isError && items.length === 0 && hasPreviousPage;

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

  return (
    <PageShell>
      <section
        className="space-y-6 py-6 sm:space-y-10 sm:py-16"
        aria-busy={isLoading}
        aria-live="polite"
      >
        <div className="space-y-3 sm:space-y-4">
          <h1 className="max-w-4xl text-2xl font-semibold tracking-tight text-white sm:text-5xl">
            Discover TV shows through a community-driven catalog
          </h1>

          <p className="max-w-2xl text-sm leading-6 text-[#d5d0c5] sm:text-base sm:leading-8">
            This catalog is built and maintained by the community. If you want
            to see a TV show added, you can{' '}
            <Link
              href="/manage/tv-shows"
              className="font-medium text-primary underline-offset-4 transition-colors hover:underline"
            >
              add it yourself
            </Link>{' '}
            or request it to be added by a administrator.
          </p>
        </div>

        <Card className="rounded-[1.25rem] border border-white/10 bg-card py-0 shadow-none ring-0 sm:rounded-3xl">
          <CardContent className="px-3 py-3 sm:px-5 sm:py-5">
            <SearchInputGroup
              id="public-tv-show-search"
              label="Search"
              value={searchInput}
              placeholder="Search by title or description"
              onChange={setSearchInput}
              onClear={handleClearSearch}
              onSubmit={handleSearchSubmit}
            />
          </CardContent>
        </Card>

        {isLoading ? (
          <div
            role="status"
            aria-label="Loading TV shows"
            className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 xl:grid-cols-6"
          >
            {Array.from({ length: tvShowsPerPage }).map((_, index) => (
              <Card
                key={index}
                className="rounded-[1.25rem] border border-white/10 bg-card py-0 shadow-none ring-0 sm:rounded-3xl"
              >
                <Skeleton className="h-44 rounded-none rounded-t-[1.25rem] bg-[#2a2c31] sm:h-64 sm:rounded-t-3xl" />
                <CardContent className="space-y-3 px-3 py-3 sm:space-y-4 sm:px-5 sm:py-5">
                  <Skeleton className="h-5 w-2/3 bg-[#31343a] sm:h-6" />
                  <Skeleton className="h-8 w-full bg-[#2a2c31] sm:h-10" />
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <Skeleton className="h-8 w-full bg-[#31343a] sm:h-9" />
                    <Skeleton className="h-8 w-full bg-[#31343a] sm:h-9" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        {isError ? (
          <div
            role="alert"
            className="rounded-[1.25rem] border border-rose-500/30 bg-rose-950/20 p-4 sm:rounded-3xl sm:p-6"
          >
            <p className="text-sm font-medium text-rose-200">
              Unable to load TV shows.
            </p>
            <p className="mt-2 text-sm text-rose-100/80">
              {error instanceof Error
                ? error.message
                : 'An unexpected error happened while loading the catalog.'}
            </p>
          </div>
        ) : null}

        {showEmptyState ? (
          <div
            role="status"
            className="rounded-[1.25rem] border border-white/10 bg-card p-6 text-center sm:rounded-3xl sm:p-10"
          >
            <p className="text-base font-medium text-white sm:text-lg">
              No TV shows matched this search.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Try a different title or clear the search to browse the full
              catalog.
            </p>
          </div>
        ) : null}

        {showCursorEmptyState ? (
          <div className="space-y-5 sm:space-y-6">
            <div
              role="status"
              className="rounded-[1.25rem] border border-white/10 bg-card p-6 text-center sm:rounded-3xl sm:p-10"
            >
              <p className="text-base font-medium text-white sm:text-lg">
                No more TV shows were returned for this cursor position.
              </p>

              <p className="mt-3 text-sm text-muted-foreground">
                You can return to the previous page without reloading the app.
              </p>

              <div className="mt-5 flex justify-center sm:mt-6">
                <Button
                  variant="outline"
                  onClick={handlePreviousPage}
                  className="w-full sm:w-auto"
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
                      href="#tv-shows-pagination"
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
                      href="#tv-shows-pagination"
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

        {!isLoading && !isError && items.length > 0 ? (
          <div className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-6">
              {items.map((tvShow) => (
                <TvShowCatalogCard key={tvShow.key} tvShow={tvShow} />
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Batch {currentPage}. Showing up to {tvShowsPerPage} series per
                request.
              </p>

              <Pagination className="mx-0 w-full justify-start sm:w-auto sm:justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#tv-shows-pagination"
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
                      href="#tv-shows-pagination"
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
  );
}
