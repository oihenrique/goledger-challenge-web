import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft, Layers2, ListVideo } from 'lucide-react';

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
import { useEpisodes } from '@/modules/episodes/hooks/use-episodes';
import { useSeasons } from '@/modules/seasons/hooks/use-seasons';
import { useTvShow } from '@/modules/tv-shows/hooks/use-tv-show';
import {
  getOrderedTvShowSeasons,
  mapEpisodesToRelationViewModels,
  resolveActiveSeason,
} from '@/modules/tv-shows/utils/tv-show-relations';
import { assetTypes } from '@/shared/types';

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
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-5">
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  TV Show
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  {data.title}
                </h1>
                <div className="flex flex-wrap gap-2 text-sm text-[#d5d0c5]">
                  <div className="inline-flex rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1">
                    Recommended age: {data.recommendedAge}+
                  </div>
                </div>
                <p className="max-w-3xl text-base leading-8 text-[#d5d0c5]">
                  {data.description}
                </p>
              </div>

              <Card className="overflow-hidden rounded-3xl border border-white/10 bg-card py-0 shadow-none ring-0">
                <div className="relative min-h-104 bg-[#2a2c31]">
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(42,44,49,0.18),rgba(15,23,42,0.94))]" />
                  <div className="relative flex h-full min-h-104 flex-col justify-between p-6">
                    <div className="inline-flex w-fit rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                      TV show cover
                    </div>
                    <div className="space-y-3">
                      <p className="text-xl font-medium text-white">
                        {data.title}
                      </p>
                      <p className="max-w-sm text-sm leading-7 text-[#d5d0c5]">
                        Reserved visual area for future cover artwork, posters
                        or editorial imagery tied to this title.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
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
                    <ButtonGroup className="flex-wrap gap-2 has-[>[data-slot=button-group]]:gap-2 [&>*]:rounded-full [&>*]:border-l">
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
                    <CardHeader className="px-6 py-6">
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
                            {episodesForSelectedSeason.length} episodes
                          </div>
                        </div>
                      ) : null}

                      {episodesForSelectedSeason.length > 0 ? (
                        <div className="grid gap-5">
                          {episodesForSelectedSeason.map((episode) => (
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
