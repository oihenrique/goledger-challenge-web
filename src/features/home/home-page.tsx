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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
          {kicker}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {title}
        </h2>
      </div>
      {href ? (
        <Button variant="outline" asChild>
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
      <section className="space-y-14 py-14 sm:space-y-16 sm:py-16">
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
                    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#25272c] transition hover:border-white/20">
                      {tvShow.coverImageUrl && (
                        <AppImage
                          src={tvShow.coverImageUrl}
                          alt={`${tvShow.title} background`}
                          fill
                          sizes="100vw"
                          className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/60" />
                      <Link
                        href={`/tv-shows/${encodeURIComponent(tvShow.title)}`}
                        className="block relative"
                      >
                        <div className="flex h-full min-h-105 items-center gap-8 px-6 py-6 sm:px-8 sm:py-8">
                          <div className="flex-1 space-y-4">
                            <div className="inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-white/90">
                              Featured today
                            </div>

                            <div className="space-y-4">
                              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                                {tvShow.title}
                              </h1>
                              <p className="line-clamp-3 max-w-2xl text-base leading-8 text-white/80">
                                {tvShow.description}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-3 text-sm text-white/90">
                              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">
                                Recommended age {tvShow.recommendedAge}+
                              </span>
                              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">
                                Updated {formatDate(tvShow.updatedAt)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm font-medium text-white">
                              <span>Open details</span>
                              <ArrowRight className="size-4" />
                            </div>
                          </div>

                          <div className="shrink-0">
                            <div className="relative w-40 aspect-2/3 overflow-hidden rounded-xl border border-white/20 bg-[#2a2c31] shadow-2xl">
                              {tvShow.coverImageUrl ? (
                                <AppImage
                                  src={tvShow.coverImageUrl}
                                  alt={`${tvShow.title} cover`}
                                  fill
                                  sizes="160px"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/60 text-xs">
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
              <CarouselPrevious className="left-4 top-48 translate-y-0 border-white/10 bg-black/30 text-white hover:bg-black/45 disabled:opacity-40" />
              <CarouselNext className="right-4 top-48 translate-y-0 border-white/10 bg-black/30 text-white hover:bg-black/45 disabled:opacity-40" />
            </Carousel>
          ) : isLoading ? (
            <Skeleton className="min-h-105 rounded-[2rem] bg-[#25272c]" />
          ) : (
            <Card className="rounded-[2rem] border border-white/10 bg-card py-0 shadow-none">
              <CardContent className="flex min-h-105 items-center justify-center px-8 py-8 text-center text-[#d5d0c5]">
                The catalog is still being populated.
              </CardContent>
            </Card>
          )}
        </section>

        <section className="space-y-6">
          <HomeSectionHeader
            kicker="What to watch"
            title="Explore the catalog"
            href="/tv-shows"
          />
          {whatToWatch.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-6">
              {whatToWatch.map((tvShow) => (
                <TvShowPosterCard
                  key={tvShow.key}
                  tvShow={tvShow}
                  href={`/tv-shows/${encodeURIComponent(tvShow.title)}`}
                />
              ))}
            </div>
          ) : isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-80 rounded-3xl bg-[#25272c]"
                />
              ))}
            </div>
          ) : null}
        </section>

        <section className="space-y-6">
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
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-6">
              {watchlistTvShows.map((tvShow) => (
                <TvShowPosterCard
                  key={tvShow.key}
                  tvShow={tvShow}
                  href={`/tv-shows/${encodeURIComponent(tvShow.title)}`}
                />
              ))}
            </div>
          ) : (
            <Card className="rounded-[1.7rem] border border-dashed border-white/10 bg-card py-0 shadow-none">
              <CardContent className="flex flex-col items-start gap-4 px-6 py-8">
                <p className="text-base text-[#d5d0c5]">
                  Watchlists are ready, but you still need to group titles into
                  them before this section can highlight anything meaningful.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/manage/watchlists">Open watchlists</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        <section className="space-y-6">
          <HomeSectionHeader
            kicker="New episodes"
            title="Fresh episode records and season updates"
          />
          {newEpisodes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {newEpisodes.map((episode) => (
                <EpisodeCard key={episode.key} episode={episode} />
              ))}
            </div>
          ) : isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-64 rounded-[1.7rem] bg-[#25272c]"
                />
              ))}
            </div>
          ) : null}
        </section>
      </section>
    </PageShell>
  );
}
