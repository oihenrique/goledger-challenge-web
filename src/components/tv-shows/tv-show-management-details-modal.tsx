import { X } from 'lucide-react';

import { Button } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { TvShowViewModel } from '@/modules/tv-shows/types/tv-show.types';

interface TvShowManagementDetailsModalProps {
  onClose: () => void;
  tvShow: TvShowViewModel;
}

export function TvShowManagementDetailsModal({
  onClose,
  tvShow,
}: TvShowManagementDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
      <div className="absolute inset-0" aria-hidden="true" onClick={onClose} />
      <Card className="relative z-10 w-full max-w-3xl rounded-[2rem] border border-white/10 bg-card py-0 shadow-none ring-0">
        <CardHeader className="border-b border-white/10 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex w-fit rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Blockchain details
              </div>
              <CardTitle className="text-2xl font-semibold text-white">
                {tvShow.title}
              </CardTitle>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={onClose}>
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 px-6 py-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="space-y-3">
              <h3 className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Description
              </h3>
              <p className="text-base leading-8 text-[#d5d0c5]">
                {tvShow.description}
              </p>
            </div>
            <div className="inline-flex rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1 text-sm text-[#d5d0c5]">
              Recommended age: {tvShow.recommendedAge}+
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-[#2a2c31] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Asset key
              </p>
              <p className="mt-2 break-all text-sm text-[#ebe5d8]">
                {tvShow.key}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#2a2c31] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Last transaction
              </p>
              <p className="mt-2 text-sm text-[#ebe5d8]">
                {tvShow.lastTransaction}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#2a2c31] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Transaction id
              </p>
              <p className="mt-2 break-all text-sm text-[#ebe5d8]">
                {tvShow.lastTransactionId}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#2a2c31] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Updated at
              </p>
              <p className="mt-2 text-sm text-[#ebe5d8]">{tvShow.updatedAt}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
