import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, BookmarkPlus, Clapperboard, Tv2 } from 'lucide-react';

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
  const whatToWatch = tvShows.slice(0, 8);

  const seasonsByKey = new Map(
    (seasonsQuery.data?.items ?? []).map((season) => [season.key, season]),
  );
  const tvShowsByKey = new Map(tvShows.map((tvShow) => [tvShow.key, tvShow]));

  const newEpisodes = [...(episodesQuery.data?.items ?? [])]
    .map((episode) => {
      const season = seasonsByKey.get(episode.seasonKey);
      const tvShow = season ? tvShowsByKey.get(season.tvShowKey) : undefined;

      return {
        ...episode,
        seasonNumber: season?.number,
        tvShowTitle: tvShow?.title,
      };
    })
    .sort(
      (left, right) =>
        new Date(right.releaseDate).getTime() -
        new Date(left.releaseDate).getTime(),
    )
    .slice(0, 6);

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
    }, 3500);

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
                    <Card className="overflow-hidden rounded-[2rem] border border-white/10 bg-card py-0 shadow-none transition hover:border-white/20">
                      <Link
                        href={`/tv-shows/${encodeURIComponent(tvShow.title)}`}
                        className="block"
                      >
                        <div className="relative min-h-105 border-b border-white/10 bg-[#25272c]">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(90,138,230,0.28),transparent_42%),linear-gradient(180deg,rgba(17,24,39,0.08),rgba(15,23,42,0.94))]" />
                          <div className="relative flex h-full min-h-105 flex-col justify-between px-6 py-6 sm:px-8 sm:py-8">
                            <div className="inline-flex mb-2 w-fit rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                              Featured today
                            </div>

                            <div className="space-y-6">
                              <div className="space-y-4">
                                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                                  {tvShow.title}
                                </h1>
                                <p className="line-clamp-4 max-w-2xl text-base leading-8 text-[#d5d0c5]">
                                  {tvShow.description}
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-3 text-sm text-[#d5d0c5]">
                                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">
                                  Recommended age {tvShow.recommendedAge}+
                                </span>
                                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">
                                  Updated {formatDate(tvShow.updatedAt)}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-sm font-medium text-[#e7dcc4]">
                                <span>Open series detail</span>
                                <ArrowRight className="size-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </Card>
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
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {whatToWatch.map((tvShow) => (
                <Link
                  key={tvShow.key}
                  href={`/tv-shows/${encodeURIComponent(tvShow.title)}`}
                  className="rounded-[1.7rem] border border-white/10 bg-card p-4 transition hover:border-white/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#25272c]">
                      <Tv2 className="size-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-lg font-semibold text-white">
                        {tvShow.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Recommended age {tvShow.recommendedAge}+
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 line-clamp-4 text-sm leading-7 text-[#d5d0c5]">
                    {tvShow.description}
                  </p>
                </Link>
              ))}
            </div>
          ) : isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-56 rounded-[1.7rem] bg-[#25272c]"
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
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {watchlistTvShows.map((tvShow) => (
                <Link
                  key={tvShow.key}
                  href={`/tv-shows/${encodeURIComponent(tvShow.title)}`}
                  className="rounded-[1.7rem] border border-white/10 bg-card p-4 transition hover:border-white/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#25272c]">
                      <BookmarkPlus className="size-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-lg font-semibold text-white">
                        {tvShow.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        In {primaryWatchlist.title}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#d5d0c5]">
                    {tvShow.description}
                  </p>
                </Link>
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
                <Card
                  key={episode.key}
                  className="rounded-[1.7rem] border border-white/10 bg-card py-0 shadow-none"
                >
                  <CardContent className="space-y-4 px-5 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#25272c]">
                        <Clapperboard className="size-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-lg font-semibold text-white">
                          {episode.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {episode.tvShowTitle || 'Unknown TV show'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm text-[#d5d0c5]">
                      <span className="rounded-full border border-white/10 bg-[#25272c] px-3 py-1">
                        Episode {episode.episodeNumber}
                      </span>
                      {episode.seasonNumber ? (
                        <span className="rounded-full border border-white/10 bg-[#25272c] px-3 py-1">
                          Season {episode.seasonNumber}
                        </span>
                      ) : null}
                      <span className="rounded-full border border-white/10 bg-[#25272c] px-3 py-1">
                        {formatDate(episode.releaseDate)}
                      </span>
                    </div>

                    <p className="line-clamp-4 text-sm leading-7 text-[#d5d0c5]">
                      {episode.description}
                    </p>
                  </CardContent>
                </Card>
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
