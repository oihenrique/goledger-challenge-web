import { LoaderCircle, Trash2, X } from 'lucide-react';

import { Button } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { TvShowViewModel } from '@/modules/tv-shows/types/tv-show.types';

interface TvShowDeleteDialogProps {
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  tvShow: TvShowViewModel;
}

export function TvShowDeleteDialog({
  isPending = false,
  onClose,
  onConfirm,
  tvShow,
}: TvShowDeleteDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-8">
      <div className="absolute inset-0" aria-hidden="true" onClick={onClose} />
      <Card className="relative z-10 w-full max-w-xl rounded-[2rem] border border-white/10 bg-card py-0 shadow-none">
        <CardHeader className="border-b border-white/10 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex w-fit rounded-full border border-rose-500/20 bg-rose-950/30 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-rose-200">
                Destructive action
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-semibold text-white">
                  Delete {tvShow.title}?
                </CardTitle>
                <p className="text-sm leading-7 text-[#d5d0c5]">
                  This action removes the title from the editorial catalog. The
                  blockchain history remains queryable, but the active asset
                  will be deleted from the workspace.
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={onClose}>
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 px-6 py-6">
          <div className="rounded-2xl border border-white/10 bg-[#2a2c31] px-4 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Asset key
            </p>
            <p className="mt-2 break-all text-sm text-[#ebe5d8]">
              {tvShow.key}
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
              <span>Delete TV show</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
