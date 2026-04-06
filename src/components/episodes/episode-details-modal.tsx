import { AssetHistoryPanel } from '@/components/shared/asset-history-panel';
import { BlockchainRecordPanel } from '@/components/shared/blockchain-record-panel';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui';
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
        showCloseButton={true}
        className="max-h-dvh w-full max-w-full overflow-y-auto rounded-none border border-white/10 bg-transparent p-0 ring-0 sm:max-w-3xl sm:rounded-[2rem]"
      >
        <Card className="w-full rounded-none border border-white/10 bg-card py-0 shadow-none ring-0 sm:rounded-[2rem]">
          <CardHeader className="border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
            <div className="space-y-2 sm:space-y-3">
              <div className="inline-flex w-fit rounded-full border border-white/10 bg-[#2a2c31] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:px-3 sm:text-[11px] sm:tracking-[0.22em]">
                Episode details
              </div>
              <CardTitle className="text-lg font-semibold text-white sm:text-2xl">
                {episode.title}
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="px-4 py-4 sm:px-6 sm:py-6">
            <Tabs defaultValue="overview" className="gap-4 sm:gap-5">
              <TabsList
                variant="line"
                className="w-full justify-start overflow-x-auto border-b border-white/10 px-0"
              >
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-4 sm:space-y-5">
                    <div className="flex flex-wrap gap-2 text-xs text-[#d5d0c5] sm:text-sm">
                      <div className="inline-flex rounded-full border border-white/10 bg-[#2a2c31] px-2.5 py-1 sm:px-3 sm:py-1">
                        Episode {episode.episodeNumber}
                      </div>
                      <div className="inline-flex rounded-full border border-white/10 bg-[#2a2c31] px-2.5 py-1 sm:px-3 sm:py-1">
                        Season {seasonNumber}
                      </div>
                      <div className="inline-flex rounded-full border border-white/10 bg-[#2a2c31] px-2.5 py-1 sm:px-3 sm:py-1">
                        {tvShowTitle}
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-sm sm:tracking-[0.22em]">
                        Description
                      </h3>
                      <p className="text-sm leading-6 text-[#d5d0c5] sm:text-base sm:leading-8">
                        {episode.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="rounded-xl border border-white/10 bg-[#2a2c31] px-4 py-4 sm:rounded-2xl">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:text-xs sm:tracking-[0.2em]">
                        Release date
                      </p>
                      <p className="mt-2 text-sm text-[#ebe5d8]">
                        {formatDate(episode.releaseDate)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-[#2a2c31] px-4 py-4 sm:rounded-2xl">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:text-xs sm:tracking-[0.2em]">
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
                </div>
              </TabsContent>

              <TabsContent value="history">
                <AssetHistoryPanel
                  assetBasePath="/api/episodes"
                  assetLabel="Episode"
                  historyKey={{
                    '@assetType': 'episodes',
                    episodeNumber: episode.episodeNumber,
                    season: {
                      '@assetType': 'seasons',
                      '@key': episode.seasonKey,
                    },
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
