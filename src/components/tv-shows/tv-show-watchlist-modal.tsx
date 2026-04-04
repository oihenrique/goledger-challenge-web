import Link from 'next/link';
import { LoaderCircle, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui';
import { InternalApiError } from '@/lib/api/internal-api-client';
import { assetTypes } from '@/shared/types';
import type { TvShowViewModel } from '@/modules/tv-shows/types/tv-show.types';
import { useWatchlists } from '@/modules/watchlists/hooks/use-watchlists';
import { useUpdateWatchlist } from '@/modules/watchlists/hooks/use-watchlist-mutations';
import {
  buildWatchlistTvShowReferences,
} from '@/modules/watchlists/utils/watchlist-relations';
import type { WatchlistViewModel } from '@/modules/watchlists/types/watchlist.types';

interface TvShowWatchlistModalProps {
  onClose: () => void;
  tvShow: TvShowViewModel;
}

function getMutationErrorMessage(error: unknown, fallback: string) {
  if (error instanceof InternalApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function TvShowWatchlistModal({
  onClose,
  tvShow,
}: TvShowWatchlistModalProps) {
  const [selectedWatchlist, setSelectedWatchlist] =
    useState<WatchlistViewModel | null>(null);
  const watchlistsQuery = useWatchlists({});
  const updateWatchlistMutation = useUpdateWatchlist();

  const watchlists = watchlistsQuery.data?.items ?? [];
  const selectedWatchlistAlreadyContainsTvShow = selectedWatchlist
    ? selectedWatchlist.tvShowKeys.includes(tvShow.key)
    : false;

  async function handleConfirm() {
    if (!selectedWatchlist) {
      return;
    }

    if (selectedWatchlistAlreadyContainsTvShow) {
      toast.message(`${tvShow.title} is already in ${selectedWatchlist.title}.`);
      return;
    }

    try {
      const nextTvShowKeys = [...selectedWatchlist.tvShowKeys, tvShow.key];

      await updateWatchlistMutation.mutateAsync({
        '@assetType': assetTypes.watchlist,
        description: selectedWatchlist.description,
        title: selectedWatchlist.title,
        tvShows: buildWatchlistTvShowReferences(nextTvShowKeys),
      });

      toast.success(`Added ${tvShow.title} to ${selectedWatchlist.title}.`);
      onClose();
    } catch (mutationError) {
      toast.error(
        getMutationErrorMessage(
          mutationError,
          'Unable to add this TV show to the selected watchlist.',
        ),
      );
    }
  }

  return (
    <Dialog open onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-transparent p-0 ring-0 sm:max-w-2xl"
      >
        <Card className="w-full rounded-[2rem] border border-white/10 bg-card py-0 shadow-none">
          <CardHeader className="border-b border-white/10 px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="inline-flex w-fit rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Add to watchlist
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-semibold text-white">
                    Choose a watchlist for {tvShow.title}
                  </CardTitle>
                  <p className="max-w-xl text-sm leading-7 text-[#d5d0c5]">
                    Select one watchlist to save this title for later.
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={onClose}>
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 px-6 py-6">
            {watchlistsQuery.isLoading ? (
              <div className="h-56 rounded-2xl border border-white/10 bg-[#2a2c31]" />
            ) : null}

            {watchlistsQuery.isError ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-950/20 px-4 py-4">
                <p className="text-sm font-medium text-rose-200">
                  Unable to load watchlists.
                </p>
                <p className="mt-2 text-sm text-rose-100/80">
                  {watchlistsQuery.error instanceof Error
                    ? watchlistsQuery.error.message
                    : 'An unexpected error happened while loading watchlists.'}
                </p>
              </div>
            ) : null}

            {!watchlistsQuery.isLoading &&
            !watchlistsQuery.isError &&
            watchlists.length === 0 ? (
              <Empty className="rounded-2xl border border-dashed border-white/10 bg-[#1c1d21] p-10">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Plus />
                  </EmptyMedia>
                  <EmptyTitle className="text-white">
                    No watchlists available
                  </EmptyTitle>
                  <EmptyDescription className="text-[#d5d0c5]">
                    Create your first watchlist before adding titles from the
                    public catalog.
                  </EmptyDescription>
                </EmptyHeader>
                <Button variant="outline" asChild>
                  <Link href="/manage/watchlists">Open watchlists</Link>
                </Button>
              </Empty>
            ) : null}

            {!watchlistsQuery.isLoading &&
            !watchlistsQuery.isError &&
            watchlists.length > 0 ? (
              <>
                <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
                  {watchlists.map((watchlist) => {
                    const isSelected = selectedWatchlist?.key === watchlist.key;
                    const containsTvShow = watchlist.tvShowKeys.includes(
                      tvShow.key,
                    );

                    return (
                      <button
                        key={watchlist.key}
                        type="button"
                        onClick={() => setSelectedWatchlist(watchlist)}
                        className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                          isSelected
                            ? 'border-[#7c6135] bg-[#2a2c31]'
                            : 'border-white/10 bg-[#1c1d21] hover:bg-[#23252a]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-medium text-white">
                              {watchlist.title}
                            </p>
                            <p className="mt-1 text-sm text-[#d5d0c5]">
                              {watchlist.tvShowKeys.length}{' '}
                              {watchlist.tvShowKeys.length === 1
                                ? 'title'
                                : 'titles'}
                            </p>
                          </div>
                          {containsTvShow ? (
                            <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[#d5d0c5]">
                              Added
                            </span>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    disabled={
                      !selectedWatchlist ||
                      updateWatchlistMutation.isPending ||
                      selectedWatchlistAlreadyContainsTvShow
                    }
                    onClick={() => void handleConfirm()}
                  >
                    {updateWatchlistMutation.isPending ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <Plus className="size-4" />
                    )}
                    <span>Add to watchlist</span>
                  </Button>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
