import { Copy, Shield } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui';
import { formatTimestamp } from '@/lib/date';

interface BlockchainRecordPanelProps {
  assetKey: string;
  className?: string;
  lastTransaction: string;
  lastTransactionId: string;
  updatedAt: string;
}

export function BlockchainRecordPanel({
  assetKey,
  className,
  lastTransaction,
  lastTransactionId,
  updatedAt,
}: BlockchainRecordPanelProps) {
  async function handleCopyTransactionId() {
    try {
      await navigator.clipboard.writeText(lastTransactionId);
      toast.success('Transaction id copied.');
    } catch {
      toast.error('Unable to copy transaction id.');
    }
  }

  return (
    <div
      className={`space-y-4 rounded-2xl border border-white/10 bg-[#2a2c31] px-4 py-4 ${
        className ?? ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Shield className="size-4 text-muted-foreground" />
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Blockchain record
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => void handleCopyTransactionId()}
        >
          <Copy className="size-4" />
          <span>Copy txID</span>
        </Button>
      </div>

      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Last action
        </p>
        <p className="text-sm text-[#ebe5d8]">{lastTransaction}</p>
      </div>

      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Transaction id
        </p>
        <p className="break-all text-sm text-[#ebe5d8]">{lastTransactionId}</p>
      </div>

      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Last updated
        </p>
        <p className="text-sm text-[#ebe5d8]">
          {formatTimestamp(updatedAt, {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </p>
      </div>

      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Asset key
        </p>
        <p className="break-all text-sm text-[#ebe5d8]">{assetKey}</p>
      </div>
    </div>
  );
}
