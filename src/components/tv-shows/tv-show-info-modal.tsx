import Link from 'next/link';
import { ExternalLink, Layers2, Plus, X } from 'lucide-react';

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
        showCloseButton={false}
        className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-transparent p-0 ring-0 sm:max-w-3xl"
      >
        <Card className="w-full rounded-[2rem] border border-white/10 bg-card py-0 shadow-none ring-0">
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
            <div className="min-h-72 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#2a2c31]">
              <div className="flex h-full flex-col justify-between bg-[linear-gradient(180deg,rgba(42,44,49,0.24),rgba(15,23,42,0.92))] p-5">
                <div className="inline-flex w-fit rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  TV show artwork
                </div>
                <div className="space-y-3">
                  <p className="text-lg font-medium text-white">
                    {tvShow.title}
                  </p>
                  <p className="text-sm leading-7 text-[#d5d0c5]">
                    Visual space reserved for future catalog imagery and richer
                    editorial art direction.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2 text-sm text-[#d5d0c5]">
                <div className="inline-flex rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1">
                  Recommended age: {tvShow.recommendedAge}+
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1">
                  <Layers2 className="size-4 text-muted-foreground" />
                  Ready for TV show hub
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Synopsis
                </h3>
                <p className="text-base leading-8 text-[#d5d0c5]">
                  {tvShow.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
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
