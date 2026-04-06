import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft, Layers2, ListVideo, Plus } from 'lucide-react';

import { AppImage } from '@/components/shared/app-image';
import { TvShowEpisodeCard } from '@/components/tv-shows/tv-show-episode-card';
import { TvShowWatchlistModal } from '@/components/tv-shows/tv-show-watchlist-modal';
import { TvShowRelationsSkeleton } from '@/components/tv-shows/tv-show-relations-skeleton';
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui';
import { Skeleton } from '@/components/ui';
import { PageShell } from '@/layout/page-shell';
import {
  useMultipleTmdbEpisodeImages,
  getBestTmdbEpisodeImageUrl,
  useTmdbTvShows,
  getBestTmdbSeriesId,
} from '@/modules/themoviedb';
import {
  getOrderedTvShowSeasons,
  mapEpisodesToRelationViewModels,
  resolveActiveSeason,
} from '@/modules/tv-shows/utils/tv-show-relations';
import { assetTypes } from '@/shared/types';
import { useTvShow } from '@/modules/tv-shows/hooks/use-tv-show';
import { useSeasons } from '@/modules/seasons/hooks/use-seasons';
import { useEpisodes } from '@/modules/episodes/hooks/use-episodes';

interface TvShowDetailPageProps {
  title: string;
}

const relationBatchLimit = 100;

export function TvShowDetailPage({ title }: TvShowDetailPageProps) {
  const { data, isLoading, isError, error } = useTvShow({
    '@assetType': assetTypes.tvShows,
    title,
  });

  const [isWatchlistModalOpen, setIsWatchlistModalOpen] = useState(false);
  const [selectedSeasonKey, setSelectedSeasonKey] = useState<string | null>(
    null,
  );

  const seasonsQuery = useSeasons(
    { limit: relationBatchLimit, tvShowKey: data?.key },
    { enabled: Boolean(data?.key) },
  );

  const coverImageUrl = data?.coverImageUrl;

  const seasons = getOrderedTvShowSeasons(
    seasonsQuery.data?.items ?? [],
    data ?? null,
  );

  const selectedSeason = resolveActiveSeason(seasons, selectedSeasonKey);
  const activeSeasonKey = selectedSeason?.key ?? null;

  const episodesQuery = useEpisodes(
    {
      seasonKey: activeSeasonKey ?? undefined,
    },
    { enabled: Boolean(activeSeasonKey) },
  );

  const episodesForSelectedSeason = mapEpisodesToRelationViewModels(
    episodesQuery.data?.items ?? [],
    selectedSeason,
    data ?? null,
  );

  const tmdbQuery = useTmdbTvShows(data?.title ?? '');

  const tvShowTmdbId =
    data?.tmdbSeriesId ||
    (tmdbQuery.data && tmdbQuery.data.length > 0
      ? getBestTmdbSeriesId(tmdbQuery.data, data!.title)
      : undefined);

  const episodeImageRequests = episodesForSelectedSeason
    .filter((episode) => tvShowTmdbId && episode.seasonNumber)
    .map((episode) => ({
      tmdbSeriesId: tvShowTmdbId!,
      seasonNumber: episode.seasonNumber!,
      episodeNumber: episode.episodeNumber,
    }));

  const episodeImageQueries =
    useMultipleTmdbEpisodeImages(episodeImageRequests);

  const episodesWithImages = episodesForSelectedSeason.map((episode) => {
    const imageQueryIndex = episodeImageRequests.findIndex(
      (req) =>
        req.tmdbSeriesId === tvShowTmdbId &&
        req.seasonNumber === episode.seasonNumber &&
        req.episodeNumber === episode.episodeNumber,
    );

    const episodeImages =
      imageQueryIndex >= 0
        ? (episodeImageQueries[imageQueryIndex]?.data ?? [])
        : [];

    return {
      ...episode,
      episodeImageUrl: getBestTmdbEpisodeImageUrl(episodeImages),
    };
  });

  const isRelationsLoading = seasonsQuery.isLoading || episodesQuery.isLoading;
  const isRelationsError = seasonsQuery.isError || episodesQuery.isError;
  const relationsError = seasonsQuery.error ?? episodesQuery.error;

  return (
    <PageShell>
      <section className="space-y-6 py-6 sm:space-y-8 sm:py-16">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="w-full sm:w-auto"
          >
            <Link href="/tv-shows">
              <ChevronLeft className="size-4" />
              <span>Back to catalog</span>
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4 sm:space-y-6">
            <Skeleton className="h-10 w-40 rounded-xl bg-[#31343a] sm:h-16 sm:w-1/2" />
            <Skeleton className="h-105 w-full rounded-[1.5rem] bg-[#2a2c31] sm:h-130 sm:rounded-[2rem]" />
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
              <Skeleton className="h-32 w-full rounded-[1.25rem] bg-[#2a2c31] sm:h-40 sm:rounded-[1.7rem]" />
              <Skeleton className="h-32 w-full rounded-[1.25rem] bg-[#2a2c31] sm:h-40 sm:rounded-[1.7rem]" />
              <Skeleton className="h-32 w-full rounded-[1.25rem] bg-[#2a2c31] sm:h-40 sm:rounded-[1.7rem]" />
            </div>
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-[1.25rem] border border-rose-500/30 bg-rose-950/20 p-4 sm:rounded-3xl sm:p-6">
            <p className="text-sm font-medium text-rose-200">
              Unable to load this TV show.
            </p>
            <p className="mt-2 text-sm text-rose-100/80">
              {error instanceof Error
                ? error.message
                : 'An unexpected error happened while loading the series.'}
            </p>
          </div>
        ) : null}

        {!isLoading && !isError && data ? (
          <>
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-linear-to-br from-[#1d1f25] via-[#1d1f25] to-[#22252c] sm:rounded-3xl">
              {coverImageUrl ? (
                <AppImage
                  src={coverImageUrl}
                  alt={`${data.title} background`}
                  fill
                  sizes="100vw"
                  className="absolute inset-0 h-full w-full scale-105 object-cover blur-sm"
                />
              ) : null}

              <div className="absolute inset-0 bg-black/65" />

              <div className="relative grid gap-6 p-4 sm:gap-8 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
                <div className="order-2 space-y-4 sm:space-y-5 lg:order-1">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/80 sm:text-xs sm:tracking-[0.28em]">
                    TV Show
                  </p>

                  <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-5xl">
                    {data.title}
                  </h1>

                  <div className="flex flex-wrap gap-2 text-xs text-white/90 sm:text-sm">
                    <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-2.5 py-1 sm:px-3 sm:py-1">
                      Recommended age: {data.recommendedAge}+
                    </div>
                  </div>

                  <p className="max-w-3xl max-h-40 overflow-y-auto pr-2 text-sm leading-6 text-white/80 sm:max-h-48 sm:text-base sm:leading-8">
                    {data.description}
                  </p>

                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsWatchlistModalOpen(true)}
                      className="w-full sm:w-auto"
                    >
                      <Plus className="size-4" />
                      <span>Add to watchlist</span>
                    </Button>
                  </div>
                </div>

                <div className="order-1 flex items-center justify-center lg:order-2 lg:justify-end">
                  <div className="relative aspect-2/3 w-32 overflow-hidden rounded-xl border border-white/20 bg-[#2a2c31] shadow-2xl sm:w-full sm:max-w-64 sm:rounded-2xl">
                    {coverImageUrl ? (
                      <AppImage
                        src={coverImageUrl}
                        alt={`${data.title} cover`}
                        fill
                        sizes="(max-width: 640px) 128px, 256px"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center px-4 text-center text-xs text-white/60 sm:text-sm">
                        No image available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5 sm:space-y-6">
              <Card className="rounded-[1.25rem] border border-white/10 bg-card py-0 shadow-none ring-0 sm:rounded-3xl">
                <CardHeader className="space-y-4 px-4 py-5 sm:px-6 sm:py-6">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2 text-base text-white sm:text-lg">
                      <Layers2 className="size-5 text-muted-foreground" />
                      Seasons
                    </CardTitle>

                    <p className="text-sm leading-6 text-[#d5d0c5] sm:leading-7">
                      Select a season to update the related episodes below.
                    </p>
                  </div>

                  {isRelationsLoading ? (
                    <TvShowRelationsSkeleton />
                  ) : isRelationsError ? (
                    <div className="rounded-[1rem] border border-rose-500/30 bg-rose-950/20 p-4 sm:rounded-2xl sm:p-5">
                      <p className="text-sm font-medium text-rose-200">
                        Unable to load related seasons and episodes.
                      </p>
                      <p className="mt-2 text-sm text-rose-100/80">
                        {relationsError instanceof Error
                          ? relationsError.message
                          : 'An unexpected error happened while loading related content.'}
                      </p>
                    </div>
                  ) : seasons.length > 0 ? (
                    <div className="overflow-x-auto pb-1">
                      <ButtonGroup className="flex w-max min-w-full flex-nowrap gap-2 has-[>[data-slot=button-group]]:gap-2 sm:flex-wrap sm:w-auto sm:min-w-0 *:rounded-full *:border-l">
                        {seasons.map((season) => {
                          const isSelected = selectedSeason?.key === season.key;

                          return (
                            <Button
                              key={season.key}
                              variant={isSelected ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setSelectedSeasonKey(season.key)}
                              className="shrink-0"
                            >
                              {season.number}
                            </Button>
                          );
                        })}
                      </ButtonGroup>
                    </div>
                  ) : (
                    <Empty className="rounded-[1rem] border border-white/10 bg-[#1f2126] p-6 sm:rounded-2xl sm:p-8">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <Layers2 />
                        </EmptyMedia>
                        <EmptyTitle className="text-white">
                          No seasons published yet
                        </EmptyTitle>
                        <EmptyDescription className="text-[#d5d0c5]">
                          This TV show does not have related seasons in the
                          catalog right now.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  )}
                </CardHeader>
              </Card>

              {!isRelationsLoading &&
              !isRelationsError &&
              seasons.length > 0 ? (
                <div className="grid gap-5 sm:gap-6">
                  <Card className="rounded-[1.25rem] border border-white/10 bg-card py-0 shadow-none ring-0 sm:rounded-3xl">
                    <CardHeader className="px-4 pt-5 sm:px-6 sm:pt-6">
                      <CardTitle className="flex items-center gap-2 text-base text-white sm:text-lg">
                        <ListVideo className="size-5 text-muted-foreground" />
                        {selectedSeason
                          ? `Episodes from season ${selectedSeason.number}`
                          : 'Episodes'}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4 px-4 pb-5 sm:space-y-5 sm:px-6 sm:pb-6">
                      {selectedSeason ? (
                        <div className="flex flex-wrap gap-2 text-xs text-[#d5d0c5] sm:text-sm">
                          <div className="inline-flex rounded-full border border-white/10 bg-[#2a2c31] px-2.5 py-1 sm:px-3 sm:py-1">
                            Season {selectedSeason.number}
                          </div>
                          <div className="inline-flex rounded-full border border-white/10 bg-[#2a2c31] px-2.5 py-1 sm:px-3 sm:py-1">
                            Released in {selectedSeason.year}
                          </div>
                          <div className="inline-flex rounded-full border border-white/10 bg-[#2a2c31] px-2.5 py-1 sm:px-3 sm:py-1">
                            {episodesWithImages.length} episodes
                          </div>
                        </div>
                      ) : null}

                      {episodesWithImages.length > 0 ? (
                        <div className="grid gap-4 sm:gap-5">
                          {episodesWithImages.map((episode) => (
                            <TvShowEpisodeCard
                              key={episode.key}
                              episode={episode}
                            />
                          ))}
                        </div>
                      ) : (
                        <Empty className="rounded-[1rem] border border-white/10 bg-[#1f2126] p-6 sm:rounded-2xl sm:p-8">
                          <EmptyHeader>
                            <EmptyMedia variant="icon">
                              <ListVideo />
                            </EmptyMedia>
                            <EmptyTitle className="text-white">
                              No episodes for this season
                            </EmptyTitle>
                            <EmptyDescription className="text-[#d5d0c5]">
                              Select another season or wait until new episodes
                              are published in the catalog.
                            </EmptyDescription>
                          </EmptyHeader>
                        </Empty>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </section>

      {data && isWatchlistModalOpen ? (
        <TvShowWatchlistModal
          tvShow={data}
          onClose={() => setIsWatchlistModalOpen(false)}
        />
      ) : null}
    </PageShell>
  );
}
