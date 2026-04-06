import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

import { AppImage } from '@/components/shared/app-image';
import {
  Button,
  Card,
  CardContent,
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Skeleton,
} from '@/components/ui';
import { PageShell } from '@/layout/page-shell';
import { formatDate } from '@/lib/date';
import { useEpisodes } from '@/modules/episodes/hooks/use-episodes';
import { useSeasons } from '@/modules/seasons/hooks/use-seasons';
import { useTvShows } from '@/modules/tv-shows/hooks/use-tv-shows';
import { useWatchlists } from '@/modules/watchlists/hooks/use-watchlists';
import { getWatchlistTvShows } from '@/modules/watchlists/utils/watchlist-relations';
import { TvShowPosterCard } from '@/components/tv-shows/tv-show-poster-card';
import { EpisodeCard } from '@/components/episodes/episode-card';
import {
  useMultipleTmdbEpisodeImages,
  getBestTmdbEpisodeImageUrl,
  useMultipleTmdbTvShows,
  getBestTmdbSeriesId,
} from '@/modules/themoviedb';

const homeBatchLimit = 100;

function HomeSectionHeader({
  href,
  kicker,
  title,
}: {
  href?: string;
  kicker: string;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1.5 sm:space-y-2">
        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground sm:text-xs sm:tracking-[0.28em]">
          {kicker}
        </p>
        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-3xl">
          {title}
        </h2>
      </div>

      {href ? (
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href={href}>
            <span>See more</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}

export function HomePage() {
  const [heroCarouselApi, setHeroCarouselApi] = useState<CarouselApi>();
  const tvShowsQuery = useTvShows({ limit: homeBatchLimit });
  const seasonsQuery = useSeasons({ limit: homeBatchLimit });
  const episodesQuery = useEpisodes({ limit: homeBatchLimit });
  const watchlistsQuery = useWatchlists({});

  const tvShows = [...(tvShowsQuery.data?.items ?? [])].sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );

  const featuredToday = tvShows.slice(0, 4);
  const whatToWatch = tvShows.slice(0, 12);

  const seasonsByKey = new Map(
    (seasonsQuery.data?.items ?? []).map((season) => [season.key, season]),
  );
  const tvShowsByKey = new Map(tvShows.map((tvShow) => [tvShow.key, tvShow]));

  const rawNewEpisodes = [...(episodesQuery.data?.items ?? [])]
    .map((episode) => {
      const season = seasonsByKey.get(episode.seasonKey);
      const tvShow = season ? tvShowsByKey.get(season.tvShowKey) : undefined;

      return {
        ...episode,
        seasonNumber: season?.number,
        tvShowTitle: tvShow?.title,
        coverImageUrl: tvShow?.coverImageUrl,
        tmdbSeriesId: tvShow?.tmdbSeriesId,
      };
    })
    .sort(
      (left, right) =>
        new Date(right.releaseDate).getTime() -
        new Date(left.releaseDate).getTime(),
    )
    .slice(0, 6);

  const tvShowsWithoutId = rawNewEpisodes
    .filter((episode) => episode.tvShowTitle && !episode.tmdbSeriesId)
    .map((episode) => episode.tvShowTitle!)
    .filter((title, index, arr) => arr.indexOf(title) === index);

  const tmdbQueries = useMultipleTmdbTvShows(tvShowsWithoutId);

  const titleToTmdbIdMap = new Map<string, number>();
  tvShowsWithoutId.forEach((title, index) => {
    const query = tmdbQueries[index];
    if (query.data && query.data.length > 0) {
      const seriesId = getBestTmdbSeriesId(query.data, title);
      if (seriesId) {
        titleToTmdbIdMap.set(title, seriesId);
      }
    }
  });

  const episodesWithTmdbIds = rawNewEpisodes.map((episode) => ({
    ...episode,
    tmdbSeriesId:
      episode.tmdbSeriesId || titleToTmdbIdMap.get(episode.tvShowTitle || ''),
  }));

  const episodeImageRequests = episodesWithTmdbIds
    .filter((episode) => episode.tmdbSeriesId && episode.seasonNumber)
    .map((episode) => ({
      tmdbSeriesId: episode.tmdbSeriesId!,
      seasonNumber: episode.seasonNumber!,
      episodeNumber: episode.episodeNumber,
    }));

  const episodeImageQueries =
    useMultipleTmdbEpisodeImages(episodeImageRequests);

  const newEpisodes = episodesWithTmdbIds.map((episode) => {
    const imageQueryIndex = episodeImageRequests.findIndex(
      (req) =>
        req.tmdbSeriesId === episode.tmdbSeriesId &&
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

  const primaryWatchlist = watchlistsQuery.data?.items?.[0] ?? null;
  const watchlistTvShows = getWatchlistTvShows(
    primaryWatchlist,
    tvShowsQuery.data?.items ?? [],
  ).slice(0, 4);

  const isLoading =
    tvShowsQuery.isLoading ||
    seasonsQuery.isLoading ||
    episodesQuery.isLoading ||
    watchlistsQuery.isLoading;

  useEffect(() => {
    if (!heroCarouselApi || featuredToday.length <= 1) {
      return;
    }

    const autoplayInterval = window.setInterval(() => {
      if (heroCarouselApi.canScrollNext()) {
        heroCarouselApi.scrollNext();
        return;
      }

      heroCarouselApi.scrollTo(0);
    }, 7000);

    return () => {
      window.clearInterval(autoplayInterval);
    };
  }, [featuredToday.length, heroCarouselApi]);

  return (
    <PageShell>
      <section className="space-y-8 py-6 sm:space-y-16 sm:py-16">
        <section>
          {featuredToday.length > 0 ? (
            <Carousel
              setApi={setHeroCarouselApi}
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {featuredToday.map((tvShow) => (
                  <CarouselItem key={tvShow.key}>
                    <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#25272c] transition hover:border-white/20 sm:rounded-[2rem]">
                      {tvShow.coverImageUrl && (
                        <AppImage
                          src={tvShow.coverImageUrl}
                          alt={`${tvShow.title} background`}
                          fill
                          sizes="100vw"
                          className="absolute inset-0 h-full w-full scale-110 object-cover blur-sm"
                        />
                      )}

                      <div className="absolute inset-0 bg-black/65" />

                      <Link
                        href={`/tv-shows/${encodeURIComponent(tvShow.title)}`}
                        className="relative block"
                      >
                        <div className="flex min-h-105 flex-col-reverse justify-between gap-6 px-4 py-5 sm:min-h-130 sm:flex-row sm:items-center sm:gap-8 sm:px-8 sm:py-8">
                          <div className="flex-1 space-y-3 sm:space-y-4">
                            <div className="inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/90 sm:text-[11px] sm:tracking-[0.22em]">
                              Featured today
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                              <h1 className="max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-5xl">
                                {tvShow.title}
                              </h1>

                              <p className="line-clamp-2 max-w-2xl text-sm leading-6 text-white/80 sm:line-clamp-3 sm:text-base sm:leading-8">
                                {tvShow.description}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2 text-xs text-white/90 sm:gap-3 sm:text-sm">
                              <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 sm:px-3 sm:py-1">
                                Recommended age {tvShow.recommendedAge}+
                              </span>
                              <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 sm:px-3 sm:py-1">
                                Updated {formatDate(tvShow.updatedAt)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm font-medium text-white">
                              <span>Open details</span>
                              <ArrowRight className="size-4" />
                            </div>
                          </div>

                          <div className="mx-auto shrink-0 sm:mx-0">
                            <div className="relative aspect-2/3 w-28 overflow-hidden rounded-xl border border-white/20 bg-[#2a2c31] shadow-2xl sm:w-40">
                              {tvShow.coverImageUrl ? (
                                <AppImage
                                  src={tvShow.coverImageUrl}
                                  alt={`${tvShow.title} cover`}
                                  fill
                                  sizes="(max-width: 640px) 112px, 160px"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-white/60">
                                  No image
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="left-3 top-1/2 hidden -translate-y-1/2 border-white/10 bg-black/40 text-white hover:bg-black/55 disabled:opacity-40 sm:flex" />
              <CarouselNext className="right-3 top-1/2 hidden -translate-y-1/2 border-white/10 bg-black/40 text-white hover:bg-black/55 disabled:opacity-40 sm:flex" />
            </Carousel>
          ) : isLoading ? (
            <Skeleton className="min-h-105 rounded-[1.5rem] bg-[#25272c] sm:min-h-130 sm:rounded-[2rem]" />
          ) : (
            <Card className="rounded-[1.5rem] border border-white/10 bg-card py-0 shadow-none sm:rounded-[2rem]">
              <CardContent className="flex min-h-105 items-center justify-center px-6 py-8 text-center text-[#d5d0c5] sm:min-h-130 sm:px-8">
                The catalog is still being populated.
              </CardContent>
            </Card>
          )}
        </section>

        <section className="space-y-5 sm:space-y-6">
          <HomeSectionHeader
            kicker="What to watch"
            title="Explore the catalog"
            href="/tv-shows"
          />

          {whatToWatch.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 xl:grid-cols-6">
              {whatToWatch.map((tvShow) => (
                <TvShowPosterCard
                  key={tvShow.key}
                  tvShow={tvShow}
                  href={`/tv-shows/${encodeURIComponent(tvShow.title)}`}
                />
              ))}
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 xl:grid-cols-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-56 rounded-2xl bg-[#25272c] sm:h-80 sm:rounded-3xl"
                />
              ))}
            </div>
          ) : null}
        </section>

        <section className="space-y-5 sm:space-y-6">
          <HomeSectionHeader
            kicker="From your list"
            title={
              primaryWatchlist
                ? `${primaryWatchlist.title} is ready to keep growing`
                : 'Save titles into a watchlist and continue from there.'
            }
            href="/manage/watchlists"
          />

          {primaryWatchlist && watchlistTvShows.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 xl:grid-cols-6">
              {watchlistTvShows.map((tvShow) => (
                <TvShowPosterCard
                  key={tvShow.key}
                  tvShow={tvShow}
                  href={`/tv-shows/${encodeURIComponent(tvShow.title)}`}
                />
              ))}
            </div>
          ) : (
            <Card className="rounded-[1.25rem] border border-dashed border-white/10 bg-card py-0 shadow-none sm:rounded-[1.7rem]">
              <CardContent className="flex flex-col items-start gap-4 px-4 py-6 sm:px-6 sm:py-8">
                <p className="text-sm text-[#d5d0c5] sm:text-base">
                  Watchlists are ready, but you still need to group titles into
                  them before this section can highlight anything meaningful.
                </p>

                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <Link href="/manage/watchlists">Open watchlists</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        <section className="space-y-5 sm:space-y-6">
          <HomeSectionHeader
            kicker="New episodes"
            title="Fresh episode records and season updates"
          />

          {newEpisodes.length > 0 ? (
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
              {newEpisodes.map((episode) => (
                <EpisodeCard key={episode.key} episode={episode} />
              ))}
            </div>
          ) : isLoading ? (
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-52 rounded-[1.25rem] bg-[#25272c] sm:h-64 sm:rounded-[1.7rem]"
                />
              ))}
            </div>
          ) : null}
        </section>
      </section>
    </PageShell>
  );
}
