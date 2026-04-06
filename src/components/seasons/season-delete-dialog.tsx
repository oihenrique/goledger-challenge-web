import { LoaderCircle, Trash2 } from 'lucide-react';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
} from '@/components/ui';
import type { SeasonViewModel } from '@/modules/seasons/types/season.types';

interface SeasonDeleteDialogProps {
  episodeCount: number;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  season: SeasonViewModel;
  tvShowTitle: string;
}

export function SeasonDeleteDialog({
  episodeCount,
  isPending = false,
  onClose,
  onConfirm,
  season,
  tvShowTitle,
}: SeasonDeleteDialogProps) {
  const isBlocked = episodeCount > 0;

  return (
    <Dialog open onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent
        showCloseButton={true}
        className="max-h-dvh w-full max-w-full overflow-y-auto rounded-none border border-white/10 bg-transparent p-0 ring-0 sm:max-w-xl sm:rounded-[2rem]"
      >
        <Card className="w-full rounded-none border border-white/10 bg-card py-0 shadow-none sm:rounded-[2rem]">
          <CardHeader className="border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
            <div className="space-y-2 sm:space-y-3">
              <div className="inline-flex w-fit rounded-full border border-rose-500/20 bg-rose-950/30 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-rose-200 sm:px-3 sm:text-[11px] sm:tracking-[0.22em]">
                Destructive action
              </div>

              <div className="space-y-2">
                <CardTitle className="text-lg font-semibold text-white sm:text-2xl">
                  Delete season {season.number}?
                </CardTitle>

                <p className="text-sm leading-6 text-[#d5d0c5] sm:leading-7">
                  This removes the selected season from{' '}
                  <span className="font-medium text-white">{tvShowTitle}</span>.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-6 sm:py-6">
            <div className="rounded-xl border border-white/10 bg-[#2a2c31] px-3 py-3 sm:rounded-2xl sm:px-4 sm:py-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:text-xs sm:tracking-[0.2em]">
                Season status
              </p>

              <p className="mt-2 text-sm text-[#ebe5d8]">
                {episodeCount} linked{' '}
                {episodeCount === 1 ? 'episode' : 'episodes'}
              </p>

              <p className="mt-2 text-xs leading-5 text-muted-foreground sm:leading-6">
                {isBlocked
                  ? 'Delete or reassign all episodes in this season before removing it.'
                  : 'No linked episodes were found for this season.'}
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="destructive"
                disabled={isPending || isBlocked}
                onClick={() => void onConfirm()}
                className="w-full sm:w-auto"
              >
                {isPending ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                <span>Delete season</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
