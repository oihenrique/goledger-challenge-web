import { Layers2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, Dialog, DialogContent } from '@/components/ui';
import { formatTimestamp } from '@/lib/date';
import type { SeasonViewModel } from '@/modules/seasons/types/season.types';

interface SeasonDetailsModalProps {
  onClose: () => void;
  season: SeasonViewModel;
  tvShowTitle: string;
}

export function SeasonDetailsModal({
  onClose,
  season,
  tvShowTitle,
}: SeasonDetailsModalProps) {
  return (
    <Dialog open onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-transparent p-0 ring-0 sm:max-w-2xl"
      >
        <Card className="w-full rounded-[2rem] border border-white/10 bg-card py-0 shadow-none ring-0">
          <CardHeader className="border-b border-white/10 px-6 py-5">
            <div className="space-y-3">
              <div className="inline-flex w-fit rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Season details
              </div>
              <CardTitle className="text-2xl font-semibold text-white">
                Season {season.number}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 px-6 py-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2 text-sm text-[#d5d0c5]">
                <div className="inline-flex rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1">
                  Release year: {season.year}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1">
                  <Layers2 className="size-4 text-muted-foreground" />
                  Linked to {tvShowTitle}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#2a2c31] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  TV show
                </p>
                <p className="mt-2 text-sm text-[#ebe5d8]">{tvShowTitle}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#2a2c31] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Asset key
                </p>
                <p className="mt-2 break-all text-sm text-[#ebe5d8]">
                  {season.key}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#2a2c31] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Blockchain action
                </p>
                <p className="mt-2 text-sm text-[#ebe5d8]">
                  {season.lastTransaction}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#2a2c31] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Last updated
                </p>
                <p className="mt-2 text-sm text-[#ebe5d8]">
                  {formatTimestamp(season.updatedAt, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
