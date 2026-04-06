import Link from 'next/link';
import { X } from 'lucide-react';

import { AssetHistoryPanel } from '@/components/shared/asset-history-panel';
import { BlockchainRecordPanel } from '@/components/shared/blockchain-record-panel';
import { Button, Dialog, DialogContent, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
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
        className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-transparent p-0 ring-0 sm:max-w-3xl"
      >
        <Card className="w-full rounded-[2rem] border border-white/10 bg-card py-0 shadow-none ring-0">
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
          <CardContent className="px-6 py-6">
            <Tabs defaultValue="overview" className="gap-5">
              <TabsList
                variant="line"
                className="w-full justify-start border-b border-white/10 px-0"
              >
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-5">
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
                        Editorial snapshot
                      </h3>
                      <p className="max-h-48 overflow-y-auto pr-2 text-base leading-8 text-[#d5d0c5]">
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
