import { useEffect } from 'react';
import { LoaderCircle, X } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  Input,
} from '@/components/ui';
import type {
  CreateWatchlistInput,
  UpdateWatchlistInput,
  WatchlistViewModel,
} from '@/modules/watchlists/types/watchlist.types';
import { assetTypes } from '@/shared/types';

const watchlistFormSchema = z.object({
  description: z.string().max(500),
  title: z.string().trim().min(1).max(255),
});

type WatchlistFormValues = z.infer<typeof watchlistFormSchema>;

interface WatchlistFormModalProps {
  isPending?: boolean;
  mode: 'create' | 'edit';
  onClose: () => void;
  onSubmit: (
    input: CreateWatchlistInput | UpdateWatchlistInput,
  ) => Promise<void>;
  watchlist?: WatchlistViewModel | null;
}

const emptyFormValues: WatchlistFormValues = {
  description: '',
  title: '',
};

function getInitialValues(
  mode: 'create' | 'edit',
  watchlist?: WatchlistViewModel | null,
): WatchlistFormValues {
  if (mode === 'edit' && watchlist) {
    return {
      description: watchlist.description ?? '',
      title: watchlist.title,
    };
  }

  return emptyFormValues;
}

export function WatchlistFormModal({
  isPending = false,
  mode,
  onClose,
  onSubmit,
  watchlist,
}: WatchlistFormModalProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<WatchlistFormValues>({
    defaultValues: getInitialValues(mode, watchlist),
    resolver: zodResolver(watchlistFormSchema),
  });

  useEffect(() => {
    reset(getInitialValues(mode, watchlist));
  }, [mode, reset, watchlist]);

  async function handleFormSubmit(values: WatchlistFormValues) {
    const payload: CreateWatchlistInput | UpdateWatchlistInput = {
      '@assetType': assetTypes.watchlist,
      description: values.description?.trim() || undefined,
      title: values.title.trim(),
      tvShows: watchlist?.tvShowKeys.map((tvShowKey) => ({
        '@assetType': assetTypes.tvShows,
        '@key': tvShowKey,
      })),
    };

    await onSubmit(payload);
  }

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
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-semibold text-white">
                    {mode === 'create'
                      ? 'Create watchlist'
                      : `Edit ${watchlist?.title ?? 'watchlist'}`}
                  </CardTitle>
                  <p className="max-w-xl text-sm leading-7 text-[#d5d0c5]">
                    Save the watchlist metadata here. TV show items are managed
                    on the watchlist page itself.
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={onClose}>
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="px-6 py-6">
            <form
              className="space-y-5"
              onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)}
            >
              <Field>
                <FieldLabel htmlFor="watchlist-title">Title</FieldLabel>
                <FieldContent>
                  <Input
                    id="watchlist-title"
                    aria-invalid={Boolean(errors.title)}
                    placeholder="My favorites"
                    readOnly={mode === 'edit'}
                    disabled={mode === 'edit'}
                    className="h-12 rounded-2xl border-white/10 bg-[#2a2c31] px-4 text-sm text-white placeholder:text-muted-foreground focus-visible:border-[#7c6135] focus-visible:ring-0"
                    {...register('title')}
                  />
                  <FieldError
                    errors={[errors.title]}
                    className="text-rose-200"
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="watchlist-description">
                  Description
                </FieldLabel>
                <FieldContent>
                  <textarea
                    id="watchlist-description"
                    rows={5}
                    aria-invalid={Boolean(errors.description)}
                    placeholder="Optional context about the purpose of this watchlist."
                    className="w-full rounded-[1.4rem] border border-white/10 bg-[#2a2c31] px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-muted-foreground focus:border-[#7c6135] aria-invalid:border-destructive"
                    {...register('description')}
                  />
                  <FieldError
                    errors={[errors.description]}
                    className="text-rose-200"
                  />
                </FieldContent>
              </Field>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : null}
                  <span>
                    {mode === 'create' ? 'Create watchlist' : 'Save changes'}
                  </span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
