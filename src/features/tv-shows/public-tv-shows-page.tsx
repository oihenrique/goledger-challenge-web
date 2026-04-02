import Link from 'next/link';
import { Search } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { TvShowCatalogCard } from '@/components/tv-shows/tv-show-catalog-card';
import { PageShell } from '@/layout/page-shell';
import { useTvShows } from '@/modules/tv-shows/hooks/use-tv-shows';

const tvShowsPerPage = 12;

export function PublicTvShowsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentBookmark, setCurrentBookmark] = useState<string | undefined>();
  const [previousBookmarks, setPreviousBookmarks] = useState<
    Array<string | undefined>
  >([]);
  const { data, isLoading, isError, error } = useTvShows({
    limit: tvShowsPerPage,
    bookmark: currentBookmark,
    searchTerm: searchTerm.trim() || undefined,
  });
  const items = data?.items ?? [];
  const currentPage = previousBookmarks.length + 1;
  const hasNextPage = Boolean(data?.bookmark);
  const hasPreviousPage = previousBookmarks.length > 0;

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
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
      <section className="space-y-10 py-14 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Public catalog
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Discover TV shows through a community-driven editorial catalog.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[#d5d0c5]">
              This public-facing surface emphasizes discovery, context, and
              narrative. Administrative CRUD stays in the editorial workspace.
            </p>
          </div>
          <Card className="rounded-3xl border border-white/10 bg-card py-0 shadow-none ring-0">
            <CardContent className="px-6 py-6">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Workspace split
              </p>
              <p className="mt-3 text-sm leading-7 text-[#d5d0c5]">
                Need operational control instead of discovery? Move into the
                editorial workspace to manage the catalog through tables and
                CRUD flows.
              </p>
              <Button className="mt-5" variant="outline" asChild>
                <Link href="/manage/tv-shows">Open TV show management</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-3xl border border-white/10 bg-card py-0 shadow-none ring-0">
          <CardContent className="px-4 py-4 sm:px-5 sm:py-5">
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#2a2c31] px-4 py-3">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by title or description"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-muted-foreground"
              />
            </label>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: tvShowsPerPage }).map((_, index) => (
              <Card
                key={index}
                className="rounded-3xl border border-white/10 bg-card py-0 shadow-none ring-0"
              >
                <Skeleton className="h-44 rounded-none rounded-t-3xl bg-[#2a2c31]" />
                <CardContent className="space-y-4 px-5 py-5">
                  <Skeleton className="h-6 w-2/3 bg-[#31343a]" />
                  <Skeleton className="h-10 w-full bg-[#2a2c31]" />
                  <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-9 w-full bg-[#31343a]" />
                    <Skeleton className="h-9 w-full bg-[#31343a]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-3xl border border-rose-500/30 bg-rose-950/20 p-6">
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

        {!isLoading && !isError && items.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-card p-10 text-center">
            <p className="text-lg font-medium text-white">
              No TV shows matched this search.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Try a different title or clear the search to browse the full
              catalog.
            </p>
          </div>
        ) : null}

        {!isLoading && !isError && items.length > 0 ? (
          <div className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {items.map((tvShow) => (
                <TvShowCatalogCard key={tvShow.key} tvShow={tvShow} />
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Page {currentPage}. Showing up to {tvShowsPerPage} series per
                request.
              </p>
              <Pagination className="mx-0 w-auto justify-start sm:justify-end">
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
