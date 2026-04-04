import { Info, Plus } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { Button } from '@/components/ui';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { TvShowInfoModal } from '@/components/tv-shows/tv-show-info-modal';
import { TvShowWatchlistModal } from '@/components/tv-shows/tv-show-watchlist-modal';
import type { TvShowViewModel } from '@/modules/tv-shows/types/tv-show.types';

interface TvShowCatalogCardProps {
  tvShow: TvShowViewModel;
}

function createTvShowHref(title: string): string {
  return `/tv-shows/${encodeURIComponent(title)}`;
}

export function TvShowCatalogCard({ tvShow }: TvShowCatalogCardProps) {
  const router = useRouter();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isWatchlistModalOpen, setIsWatchlistModalOpen] = useState(false);
  const href = createTvShowHref(tvShow.title);

  function handleNavigateToTvShow() {
    void router.push(href);
  }

  function handleCardKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigateToTvShow();
    }
  }

  return (
    <>
      <Card
        role="link"
        tabIndex={0}
        aria-label={`Open public details for ${tvShow.title}`}
        onClick={handleNavigateToTvShow}
        onKeyDown={handleCardKeyDown}
        className="cursor-pointer rounded-3xl border border-white/10 bg-card py-0 shadow-none ring-0 transition hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <CardHeader className="px-0">
          <div className="h-44 border-b border-white/10 bg-[#2a2c31]" />
        </CardHeader>
        <CardContent className="space-y-5 px-5 pb-0">
          <div className="space-y-3">
            <div className="inline-flex w-fit rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              TV Show
            </div>
            <CardTitle className="text-xl font-semibold text-white">
              {tvShow.title}
            </CardTitle>
          </div>
        </CardContent>
        <CardFooter className="mt-auto grid gap-3 border-t border-white/10 px-5 py-4 sm:grid-cols-2">
          <Button
            variant="secondary"
            className="w-full"
            onClick={(event) => {
              event.stopPropagation();
              setIsWatchlistModalOpen(true);
            }}
          >
            <Plus className="size-4" />
            <span>Watchlist</span>
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={(event) => {
              event.stopPropagation();
              setIsInfoOpen(true);
            }}
          >
            <Info className="size-4" />
            <span>Info</span>
          </Button>
        </CardFooter>
      </Card>
      {isInfoOpen ? (
        <TvShowInfoModal tvShow={tvShow} onClose={() => setIsInfoOpen(false)} />
      ) : null}
      {isWatchlistModalOpen ? (
        <TvShowWatchlistModal
          tvShow={tvShow}
          onClose={() => setIsWatchlistModalOpen(false)}
        />
      ) : null}
    </>
  );
}
