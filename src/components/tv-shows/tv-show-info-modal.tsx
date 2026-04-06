import Link from 'next/link';
import { ExternalLink, X } from 'lucide-react';

import { AppImage } from '@/components/shared/app-image';
import { Button, Dialog, DialogContent } from '@/components/ui';
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
    <Dialog open onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent
        showCloseButton={true}
        className="w-full max-w-full rounded-none border-none bg-transparent p-0 max-h-dvh overflow-y-auto sm:max-w-3xl sm:rounded-[2rem]"
      >
        <Card className="w-full rounded-none border border-white/10 bg-card py-0 shadow-none sm:rounded-[2rem]">
          {/* HEADER */}
          <CardHeader className="px-4 py-3 sm:px-6 sm:py-5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="inline-flex w-fit rounded-full border border-white/10 bg-[#2a2c31] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:px-3 sm:py-1 sm:text-[11px] sm:tracking-[0.22em]">
                  TV Show preview
                </div>

                <CardTitle className="text-lg font-semibold text-white sm:text-2xl">
                  {tvShow.title}
                </CardTitle>
              </div>

              <Button variant="ghost" size="icon-sm" onClick={onClose}>
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </CardHeader>

          {/* CONTENT */}
          <CardContent className="space-y-5 px-4 py-4 sm:grid sm:gap-6 sm:px-6 sm:py-6 lg:grid-cols-[0.7fr_1fr]">
            {/* IMAGE */}
            <div className="relative h-44 w-full overflow-hidden rounded-xl border border-white/10 bg-[#2a2c31] sm:h-auto sm:aspect-2/3 sm:rounded-[1.5rem]">
              {tvShow.coverImageUrl ? (
                <AppImage
                  src={tvShow.coverImageUrl}
                  alt={`${tvShow.title} cover`}
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-4 text-center text-xs text-muted-foreground sm:text-sm">
                  No image available
                </div>
              )}
            </div>

            {/* TEXT CONTENT */}
            <div className="space-y-4 sm:space-y-5">
              <div className="flex flex-wrap gap-2 text-xs text-[#d5d0c5] sm:text-sm">
                <div className="inline-flex rounded-full border border-white/10 bg-[#2a2c31] px-2.5 py-1 sm:px-3 sm:py-1">
                  Recommended age: {tvShow.recommendedAge}+
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-sm sm:tracking-[0.22em]">
                  Synopsis
                </h3>

                <p className="text-sm leading-6 text-[#d5d0c5] sm:text-base sm:leading-8">
                  {tvShow.description}
                </p>
              </div>

              {/* CTA */}
              <div className="pt-2">
                <Button variant="outline" className="w-full sm:w-auto" asChild>
                  <Link href={createTvShowHref(tvShow.title)}>
                    <ExternalLink className="size-4" />
                    <span>Open full detail</span>
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
