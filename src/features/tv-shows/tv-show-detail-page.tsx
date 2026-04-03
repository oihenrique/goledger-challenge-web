import Link from 'next/link';
import {
  ChevronLeft,
  Layers2,
  ListVideo,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Skeleton } from '@/components/ui';
import { PageShell } from '@/layout/page-shell';
import { useTvShow } from '@/modules/tv-shows/hooks/use-tv-show';
import { assetTypes } from '@/shared/types';

interface TvShowDetailPageProps {
  title: string;
}

export function TvShowDetailPage({ title }: TvShowDetailPageProps) {
  const { data, isLoading, isError, error } = useTvShow({
    '@assetType': assetTypes.tvShows,
    title,
  });

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
          <Button variant="outline" size="sm" asChild>
            <Link href="/manage/tv-shows">Open editorial workspace</Link>
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
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1">
                    <Sparkles className="size-4 text-muted-foreground" />
                    Public discovery detail
                  </div>
                </div>
                <p className="max-w-3xl text-base leading-8 text-[#d5d0c5]">
                  {data.description}
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="rounded-3xl border border-white/10 bg-card py-0 shadow-none ring-0">
                <CardHeader className="px-6 py-6">
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <Layers2 className="size-5 text-muted-foreground" />
                    Seasons
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 text-sm leading-7 text-[#d5d0c5]">
                  This surface is ready to receive related seasons once the
                  relational UI for the TV show hub is implemented.
                </CardContent>
              </Card>

              <Card className="rounded-3xl border border-white/10 bg-card py-0 shadow-none ring-0">
                <CardHeader className="px-6 py-6">
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <ListVideo className="size-5 text-muted-foreground" />
                    Episodes
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 text-sm leading-7 text-[#d5d0c5]">
                  Episode summaries and release context will be attached here as
                  the TV show becomes the central content hub of the product.
                </CardContent>
              </Card>

              <Card className="rounded-3xl border border-white/10 bg-card py-0 shadow-none ring-0">
                <CardHeader className="px-6 py-6">
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <ShieldCheck className="size-5 text-muted-foreground" />
                    Editorial detail
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-6 pb-6 text-sm leading-7 text-[#d5d0c5]">
                  <p>
                    Blockchain audit metadata and operational CRUD actions will
                    live in the administrative flow for this series.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/manage/tv-shows">Go to workspace</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}
      </section>
    </PageShell>
  );
}
