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
import type { EpisodeViewModel } from '@/modules/episodes/types/episode.types';

interface EpisodeDeleteDialogProps {
  episode: EpisodeViewModel;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  seasonNumber: number;
  tvShowTitle: string;
}

export function EpisodeDeleteDialog({
  episode,
  isPending = false,
  onClose,
  onConfirm,
  seasonNumber,
  tvShowTitle,
}: EpisodeDeleteDialogProps) {
  return (
    <Dialog open onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-transparent p-0 ring-0 sm:max-w-xl"
      >
        <Card className="w-full rounded-[2rem] border border-white/10 bg-card py-0 shadow-none">
          <CardHeader className="border-b border-white/10 px-6 py-5">
            <div className="space-y-3">
              <div className="inline-flex w-fit rounded-full border border-rose-500/20 bg-rose-950/30 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-rose-200">
                Destructive action
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-semibold text-white">
                  Delete episode {episode.episodeNumber}?
                </CardTitle>
                <p className="text-sm leading-7 text-[#d5d0c5]">
                  This removes{' '}
                  <span className="font-medium text-white">{episode.title}</span>{' '}
                  from season {seasonNumber} of{' '}
                  <span className="font-medium text-white">{tvShowTitle}</span>.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 px-6 py-6">
            <div className="rounded-2xl border border-white/10 bg-[#2a2c31] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Episode summary
              </p>
              <p className="mt-2 text-sm text-[#ebe5d8]">
                {episode.title} · Episode {episode.episodeNumber}
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={isPending}
                onClick={() => void onConfirm()}
              >
                {isPending ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                <span>Delete episode</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
