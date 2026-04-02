import Link from 'next/link';
import { ExternalLink, Plus, X } from 'lucide-react';

import { Button } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { TvShowViewModel } from '@/modules/tv-shows/types/tv-show.types';

interface TvShowInfoModalProps {
  onClose: () => void;
  tvShow: TvShowViewModel;
}

function createTvShowHref(title: string): string {
  return `/tv-shows/${encodeURIComponent(title)}`;
}

export function TvShowInfoModal({ onClose, tvShow }: TvShowInfoModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
      <div className="absolute inset-0" aria-hidden="true" onClick={onClose} />
      <Card className="relative z-10 w-full max-w-3xl rounded-[2rem] border border-white/10 bg-card py-0 shadow-none ring-0">
        <CardHeader className="border-b border-white/10 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex w-fit rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                TV Show preview
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <CardTitle className="text-2xl font-semibold text-white">
                  {tvShow.title}
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={createTvShowHref(tvShow.title)}>
                    <ExternalLink className="size-4" />
                    <span>Open page</span>
                  </Link>
                </Button>
              </div>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={onClose}>
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 px-6 py-6 lg:grid-cols-[0.7fr_1fr]">
          <div className="min-h-72 rounded-[1.5rem] border border-white/10 bg-[#2a2c31]" />
          <div className="space-y-5">
            <div className="inline-flex rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1 text-sm text-[#d5d0c5]">
              Recommended age: {tvShow.recommendedAge}+
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Synopsis
              </h3>
              <p className="text-base leading-8 text-[#d5d0c5]">
                {tvShow.description}
              </p>
            </div>
            <Button className="w-full sm:w-auto">
              <Plus className="size-4" />
              <span>Add to watchlist</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
