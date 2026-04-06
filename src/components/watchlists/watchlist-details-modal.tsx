import { X } from 'lucide-react';

import { BlockchainRecordPanel } from '@/components/shared/blockchain-record-panel';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
} from '@/components/ui';
import type { WatchlistViewModel } from '@/modules/watchlists/types/watchlist.types';

interface WatchlistDetailsModalProps {
  onClose: () => void;
  watchlist: WatchlistViewModel;
}

export function WatchlistDetailsModal({
  onClose,
  watchlist,
}: WatchlistDetailsModalProps) {
  return (
    <Dialog open onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent
        showCloseButton={false}
        className="max-h-dvh w-full max-w-full overflow-y-auto rounded-none border-none bg-transparent p-0 sm:max-w-2xl sm:rounded-[2rem]"
      >
        <Card className="w-full rounded-none border border-white/10 bg-card py-0 shadow-none sm:rounded-[2rem]">
          <CardHeader className="border-b border-white/10 px-4 py-3 sm:px-6 sm:py-5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="inline-flex w-fit rounded-full border border-white/10 bg-[#2a2c31] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:px-3 sm:text-[11px] sm:tracking-[0.22em]">
                  Technical audit
                </div>

                <CardTitle className="text-lg font-semibold text-white sm:text-2xl">
                  {watchlist.title}
                </CardTitle>
              </div>

              <Button variant="ghost" size="icon-sm" onClick={onClose}>
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-6 sm:py-6">
            <BlockchainRecordPanel
              assetKey={watchlist.key}
              lastTransaction={watchlist.lastTransaction}
              lastTransactionId={watchlist.lastTransactionId}
              updatedAt={watchlist.updatedAt}
            />
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
