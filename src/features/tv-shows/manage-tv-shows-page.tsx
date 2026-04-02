import Link from 'next/link';
import { Search } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { TvShowManagementTable } from '@/components/tv-shows/tv-show-management-table';
import { PageShell } from '@/layout/page-shell';
import { useTvShows } from '@/modules/tv-shows/hooks/use-tv-shows';

export function ManageTvShowsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, isError, error } = useTvShows({
    limit: 50,
  });
  const tvShows = data?.items ?? [];

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredTvShows = tvShows.filter((tvShow) => {
    if (!normalizedSearchTerm) {
      return true;
    }

    return (
      tvShow.title.toLowerCase().includes(normalizedSearchTerm) ||
      tvShow.description.toLowerCase().includes(normalizedSearchTerm)
    );
  });

  return (
    <PageShell>
      <section className="space-y-8 py-14 sm:py-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Editorial workspace
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Manage TV shows through an operational catalog table.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[#d5d0c5]">
              This administrative surface is focused on productivity, audit, and
              future CRUD actions. Discovery lives in the public catalog.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link href="/tv-shows">Open public catalog</Link>
            </Button>
            <Button>Create TV show</Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_0.72fr]">
          <div className="rounded-3xl border border-white/10 bg-card p-4 sm:p-5">
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#2a2c31] px-4 py-3">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Filter by title or description"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-muted-foreground"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-card p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Registered
              </p>
              <p className="mt-4 text-3xl font-semibold text-white">
                {tvShows.length}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-card p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Visible rows
              </p>
              <p className="mt-4 text-3xl font-semibold text-white">
                {filteredTvShows.length}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-card p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Surface
              </p>
              <p className="mt-4 text-lg font-semibold text-white">Admin</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="h-80 rounded-3xl border border-white/10 bg-card" />
        ) : null}

        {isError ? (
          <div className="rounded-3xl border border-rose-500/30 bg-rose-950/20 p-6">
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

        {!isLoading && !isError && filteredTvShows.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-card p-10 text-center">
            <p className="text-lg font-medium text-white">
              No TV shows matched this workspace filter.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Try a different term or clear the filter to see every registered
              series.
            </p>
          </div>
        ) : null}

        {!isLoading && !isError && filteredTvShows.length > 0 ? (
          <TvShowManagementTable tvShows={filteredTvShows} />
        ) : null}
      </section>
    </PageShell>
  );
}
