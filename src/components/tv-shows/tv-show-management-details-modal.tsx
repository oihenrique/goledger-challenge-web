import Link from 'next/link';
import { X } from 'lucide-react';

import { AssetHistoryPanel } from '@/components/shared/asset-history-panel';
import { BlockchainRecordPanel } from '@/components/shared/blockchain-record-panel';
import {
  Button,
  Dialog,
  DialogContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui';
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
  const publicDetailHref = `/tv-shows/${encodeURIComponent(tvShow.title)}`;

  return (
    <Dialog open onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent
        showCloseButton={false}
        className="max-h-dvh w-full max-w-full overflow-y-auto rounded-none border-none bg-transparent p-0 ring-0 sm:max-w-3xl sm:rounded-[2rem]"
      >
        <Card className="w-full rounded-none border border-white/10 bg-card py-0 shadow-none ring-0 sm:rounded-[2rem]">
          <CardHeader className="border-b border-white/10 px-4 py-3 sm:px-6 sm:py-5">
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div className="space-y-2 sm:space-y-3">
                <div className="inline-flex w-fit rounded-full border border-white/10 bg-[#2a2c31] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:px-3 sm:text-[11px] sm:tracking-[0.22em]">
                  Editorial audit
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
                    <div className="space-y-2 sm:space-y-3">
                      <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-sm sm:tracking-[0.22em]">
                        Editorial snapshot
                      </h3>
                      <p className="max-h-48 overflow-y-auto pr-2 text-sm leading-6 text-[#d5d0c5] sm:text-base sm:leading-8">
                        {tvShow.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-[#d5d0c5] sm:text-sm">
                      <div className="inline-flex rounded-full border border-white/10 bg-[#2a2c31] px-2.5 py-1 sm:px-3 sm:py-1">
                        Recommended age: {tvShow.recommendedAge}+
                      </div>
                      <div className="inline-flex rounded-full border border-white/10 bg-[#2a2c31] px-2.5 py-1 sm:px-3 sm:py-1">
                        Root entity: TV show
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full sm:w-auto"
                      asChild
                    >
                      <Link href={publicDetailHref}>
                        Open public detail page
                      </Link>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <BlockchainRecordPanel
                      assetKey={tvShow.key}
                      lastTransaction={tvShow.lastTransaction}
                      lastTransactionId={tvShow.lastTransactionId}
                      updatedAt={tvShow.updatedAt}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history">
                <AssetHistoryPanel
                  assetBasePath="/api/tv-shows"
                  assetLabel="TV show"
                  historyKey={{
                    '@assetType': 'tvShows',
                    title: tvShow.title,
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
