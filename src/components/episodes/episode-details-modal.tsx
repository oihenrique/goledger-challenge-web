import { BlockchainRecordPanel } from '@/components/shared/blockchain-record-panel';
import { Card, CardContent, CardHeader, CardTitle, Dialog, DialogContent } from '@/components/ui';
import { formatDate } from '@/lib/date';
import type { EpisodeViewModel } from '@/modules/episodes/types/episode.types';

interface EpisodeDetailsModalProps {
  episode: EpisodeViewModel;
  onClose: () => void;
  seasonNumber: number;
  tvShowTitle: string;
}

export function EpisodeDetailsModal({
  episode,
  onClose,
  seasonNumber,
  tvShowTitle,
}: EpisodeDetailsModalProps) {
  return (
    <Dialog open onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-transparent p-0 ring-0 sm:max-w-3xl"
      >
        <Card className="w-full rounded-[2rem] border border-white/10 bg-card py-0 shadow-none ring-0">
          <CardHeader className="border-b border-white/10 px-6 py-5">
            <div className="space-y-3">
              <div className="inline-flex w-fit rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Episode details
              </div>
              <CardTitle className="text-2xl font-semibold text-white">
                {episode.title}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 px-6 py-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2 text-sm text-[#d5d0c5]">
                <div className="inline-flex rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1">
                  Episode {episode.episodeNumber}
                </div>
                <div className="inline-flex rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1">
                  Season {seasonNumber}
                </div>
                <div className="inline-flex rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1">
                  {tvShowTitle}
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Description
                </h3>
                <p className="text-base leading-8 text-[#d5d0c5]">
                  {episode.description}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#2a2c31] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Release date
                </p>
                <p className="mt-2 text-sm text-[#ebe5d8]">
                  {formatDate(episode.releaseDate)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#2a2c31] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Rating
                </p>
                <p className="mt-2 text-sm text-[#ebe5d8]">
                  {episode.rating ?? 'Not rated'}
                </p>
              </div>
              <BlockchainRecordPanel
                assetKey={episode.key}
                lastTransaction={episode.lastTransaction}
                lastTransactionId={episode.lastTransactionId}
                updatedAt={episode.updatedAt}
              />
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
