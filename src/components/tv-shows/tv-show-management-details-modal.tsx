import Link from 'next/link';
import { X } from 'lucide-react';

import { Button } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { formatTimestamp, toTimestamp } from '@/lib/date';
import type { TvShowViewModel } from '@/modules/tv-shows/types/tv-show.types';

interface TvShowManagementDetailsModalProps {
  onClose: () => void;
  tvShow: TvShowViewModel;
}

export function TvShowManagementDetailsModal({
  onClose,
  tvShow,
}: TvShowManagementDetailsModalProps) {
  const publicDetailHref = `/tv-shows/${encodeURIComponent(tvShow.title)}`;
  const lastSyncTimestamp = toTimestamp(tvShow.updatedAt);
  const formattedLastSync = formatTimestamp(tvShow.updatedAt, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
      <div className="absolute inset-0" aria-hidden="true" onClick={onClose} />
      <Card className="relative z-10 w-full max-w-3xl rounded-[2rem] border border-white/10 bg-card py-0 shadow-none ring-0">
        <CardHeader className="border-b border-white/10 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex w-fit rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Editorial audit
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
                Editorial snapshot
              </h3>
              <p className="text-base leading-8 text-[#d5d0c5]">
                {tvShow.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-[#d5d0c5]">
              <div className="inline-flex rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1">
                Recommended age: {tvShow.recommendedAge}+
              </div>
              <div className="inline-flex rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1">
                Root entity: TV show
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href={publicDetailHref}>Open public detail page</Link>
            </Button>
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
                Blockchain action
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
                Last sync point
              </p>
              <p className="mt-2 text-sm text-[#ebe5d8]">{formattedLastSync}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {lastSyncTimestamp !== null
                  ? `Timestamp: ${lastSyncTimestamp}`
                  : 'Timestamp unavailable'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
