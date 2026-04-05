import { Info, Plus } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { AppImage } from '@/components/shared/app-image';
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
          <div className="relative h-64 border-b border-white/10 bg-[#2a2c31] overflow-hidden">
            {tvShow.coverImageUrl ? (
              <AppImage
                src={tvShow.coverImageUrl}
                alt={`${tvShow.title} cover`}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                No image available
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-3 pb-0">
          <div className="space-y-3">
            <CardTitle className="text-base font-semibold text-white">
              {tvShow.title}
            </CardTitle>
          </div>
        </CardContent>
        <CardFooter className="mt-auto grid gap-3 border-t border-white/10 px-5 py-4">
          <Button
            variant="secondary"
            className="w-full"
            onClick={(event) => {
              event.stopPropagation();
              setIsWatchlistModalOpen(true);
            }}
          >
            <Plus className="size-4" />
            <span>Add</span>
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
