import { Layers2 } from 'lucide-react';

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
        showCloseButton={true}
        className="max-h-dvh w-full max-w-full overflow-y-auto rounded-none border border-white/10 bg-transparent p-0 ring-0 sm:max-w-2xl sm:rounded-[2rem]"
      >
        <Card className="w-full rounded-none border border-white/10 bg-card py-0 shadow-none ring-0 sm:rounded-[2rem]">
          <CardHeader className="border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
            <div className="space-y-2 sm:space-y-3">
              <div className="inline-flex w-fit rounded-full border border-white/10 bg-[#2a2c31] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:px-3 sm:text-[11px] sm:tracking-[0.22em]">
                Season details
              </div>
              <CardTitle className="text-lg font-semibold text-white sm:text-2xl">
                Season {season.number}
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
                        Release year: {season.year}
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#2a2c31] px-2.5 py-1 sm:px-3 sm:py-1">
                        <Layers2 className="size-4 text-muted-foreground" />
                        Linked to {tvShowTitle}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-[#2a2c31] px-4 py-4 sm:rounded-2xl">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:text-xs sm:tracking-[0.2em]">
                        TV show
                      </p>
                      <p className="mt-2 text-sm text-[#ebe5d8]">
                        {tvShowTitle}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <BlockchainRecordPanel
                      assetKey={season.key}
                      lastTransaction={season.lastTransaction}
                      lastTransactionId={season.lastTransactionId}
                      updatedAt={season.updatedAt}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history">
                <AssetHistoryPanel
                  assetBasePath="/api/seasons"
                  assetLabel="Season"
                  historyKey={{
                    '@assetType': 'seasons',
                    number: season.number,
                    tvShow: {
                      '@assetType': 'tvShows',
                      '@key': season.tvShowKey,
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
