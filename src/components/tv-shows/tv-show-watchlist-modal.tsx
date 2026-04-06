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
import { buildWatchlistTvShowReferences } from '@/modules/watchlists/utils/watchlist-relations';
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
      toast.message(
        `${tvShow.title} is already in ${selectedWatchlist.title}.`,
      );
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
        showCloseButton={true}
        className="max-h-dvh w-full max-w-full overflow-y-auto rounded-none border-none bg-transparent p-0 sm:max-w-2xl sm:rounded-[2rem]"
      >
        <Card className="w-full rounded-none border border-white/10 bg-card py-0 shadow-none sm:rounded-[2rem]">
          <CardHeader className="border-b border-white/10 px-4 py-3 sm:px-6 sm:py-5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <CardTitle className="text-lg font-semibold text-white sm:text-2xl">
                  Choose a watchlist for {tvShow.title}
                </CardTitle>
                <p className="max-w-xl text-sm leading-6 text-[#d5d0c5] sm:leading-7">
                  Select one watchlist to save this title for later.
                </p>
              </div>

              <Button variant="ghost" size="icon-sm" onClick={onClose}>
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-6 sm:py-6">
            {watchlistsQuery.isLoading ? (
              <div className="h-40 rounded-[1rem] border border-white/10 bg-[#2a2c31] sm:h-56 sm:rounded-2xl" />
            ) : null}

            {watchlistsQuery.isError ? (
              <div className="rounded-[1rem] border border-rose-500/20 bg-rose-950/20 px-4 py-4 sm:rounded-2xl">
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
              <Empty className="rounded-[1rem] border border-dashed border-white/10 bg-[#1c1d21] p-6 sm:rounded-2xl sm:p-10">
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

                <Button variant="outline" className="w-full sm:w-auto" asChild>
                  <Link href="/manage/watchlists">Open watchlists</Link>
                </Button>
              </Empty>
            ) : null}

            {!watchlistsQuery.isLoading &&
            !watchlistsQuery.isError &&
            watchlists.length > 0 ? (
              <>
                <div className="max-h-[45dvh] space-y-2 overflow-y-auto pr-1 sm:max-h-96 sm:space-y-3">
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
                        className={`w-full rounded-[1rem] border px-3 py-3 text-left transition sm:rounded-2xl sm:px-4 sm:py-4 ${
                          isSelected
                            ? 'border-[#7c6135] bg-[#2a2c31]'
                            : 'border-white/10 bg-[#1c1d21] hover:bg-[#23252a]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white sm:text-base">
                              {watchlist.title}
                            </p>
                            <p className="mt-1 text-xs text-[#d5d0c5] sm:text-sm">
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

                <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end sm:gap-3 sm:pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    className="w-full sm:w-auto"
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
