import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft, Layers2, ListVideo } from 'lucide-react';

import { AppImage } from '@/components/shared/app-image';
import { TvShowEpisodeCard } from '@/components/tv-shows/tv-show-episode-card';
import { TvShowRelationsSkeleton } from '@/components/tv-shows/tv-show-relations-skeleton';
import { Button } from '@/components/ui';
import { ButtonGroup } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
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
  const [selectedSeasonKey, setSelectedSeasonKey] = useState<string | null>(
    null,
  );
  const seasonsQuery = useSeasons({ limit: relationBatchLimit });

  const seasons = getOrderedTvShowSeasons(
    seasonsQuery.data?.items ?? [],
    data ?? null,
  );
  const selectedSeason = resolveActiveSeason(seasons, selectedSeasonKey);
  const activeSeasonKey = selectedSeason?.key ?? null;
  const episodesQuery = useEpisodes({
    seasonKey: activeSeasonKey ?? undefined,
  });
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
      <section className="space-y-8 py-14 sm:py-16">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/tv-shows">
              <ChevronLeft className="size-4" />
              <span>Back to catalog</span>
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-16 w-1/2 bg-[#31343a]" />
            <Skeleton className="h-40 w-full bg-[#2a2c31]" />
            <div className="grid gap-6 lg:grid-cols-3">
              <Skeleton className="h-40 w-full bg-[#2a2c31]" />
              <Skeleton className="h-40 w-full bg-[#2a2c31]" />
              <Skeleton className="h-40 w-full bg-[#2a2c31]" />
            </div>
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-3xl border border-rose-500/30 bg-rose-950/20 p-6">
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
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#2a2c31]">
              {data.coverImageUrl && (
                <AppImage
                  src={data.coverImageUrl}
                  alt={`${data.title} background`}
                  fill
                  sizes="100vw"
                  className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm"
                />
              )}
              <div className="absolute inset-0 bg-black/60" />
              <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] p-8 lg:p-12">
                <div className="space-y-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/80">
                    TV Show
                  </p>
                  <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    {data.title}
                  </h1>
                  <div className="flex flex-wrap gap-2 text-sm text-white/90">
                    <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1">
                      Recommended age: {data.recommendedAge}+
                    </div>
                  </div>
                  <p className="max-w-3xl text-base leading-8 text-white/80">
                    {data.description}
                  </p>
                </div>

                <div className="flex items-center justify-center lg:justify-end">
                  <div className="relative w-full max-w-64 aspect-2/3 overflow-hidden rounded-2xl border border-white/20 bg-[#2a2c31] shadow-2xl">
                    {data.coverImageUrl ? (
                      <AppImage
                        src={data.coverImageUrl}
                        alt={`${data.title} cover`}
                        fill
                        sizes="256px"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/60 text-sm">
                        No image available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="rounded-3xl border border-white/10 bg-card py-0 shadow-none ring-0">
                <CardHeader className="space-y-4 px-6 py-6">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2 text-lg text-white">
                      <Layers2 className="size-5 text-muted-foreground" />
                      Seasons
                    </CardTitle>
                    <p className="text-sm leading-7 text-[#d5d0c5]">
                      Select a season to update the related episodes below.
                    </p>
                  </div>

                  {isRelationsLoading ? (
                    <TvShowRelationsSkeleton />
                  ) : isRelationsError ? (
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5">
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
                    <ButtonGroup className="flex-wrap gap-2 has-[>[data-slot=button-group]]:gap-2 *:rounded-full *:border-l">
                      {seasons.map((season) => {
                        const isSelected = selectedSeason?.key === season.key;

                        return (
                          <Button
                            key={season.key}
                            variant={isSelected ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedSeasonKey(season.key)}
                          >
                            {season.number}
                          </Button>
                        );
                      })}
                    </ButtonGroup>
                  ) : (
                    <Empty className="rounded-2xl border border-white/10 bg-[#1f2126] p-8">
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
                <div className="grid gap-6">
                  <Card className="rounded-3xl border border-white/10 bg-card py-0 shadow-none ring-0">
                    <CardHeader className="px-6 pt-6">
                      <CardTitle className="flex items-center gap-2 text-lg text-white">
                        <ListVideo className="size-5 text-muted-foreground" />
                        {selectedSeason
                          ? `Episodes from season ${selectedSeason.number}`
                          : 'Episodes'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 px-6 pb-6">
                      {selectedSeason ? (
                        <div className="flex flex-wrap gap-2 text-sm text-[#d5d0c5]">
                          <div className="inline-flex rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1">
                            Season {selectedSeason.number}
                          </div>
                          <div className="inline-flex rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1">
                            Released in {selectedSeason.year}
                          </div>
                          <div className="inline-flex rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1">
                            {episodesWithImages.length} episodes
                          </div>
                        </div>
                      ) : null}

                      {episodesWithImages.length > 0 ? (
                        <div className="grid gap-5">
                          {episodesWithImages.map((episode) => (
                            <TvShowEpisodeCard
                              key={episode.key}
                              episode={episode}
                            />
                          ))}
                        </div>
                      ) : (
                        <Empty className="rounded-2xl border border-white/10 bg-[#1f2126] p-8">
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
                  </Card>{' '}
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </section>
    </PageShell>
  );
}
