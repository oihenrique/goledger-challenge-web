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
        className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-transparent p-0 ring-0 sm:max-w-2xl"
      >
        <Card className="w-full rounded-[2rem] border border-white/10 bg-card py-0 shadow-none">
          <CardHeader className="border-b border-white/10 px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="inline-flex w-fit rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Technical audit
                </div>
                <CardTitle className="text-2xl font-semibold text-white">
                  {watchlist.title}
                </CardTitle>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={onClose}>
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 px-6 py-6">
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
