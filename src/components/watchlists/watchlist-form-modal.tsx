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
        className="max-h-dvh w-full max-w-full overflow-y-auto rounded-none border-none bg-transparent p-0 sm:max-w-2xl sm:rounded-[2rem]"
      >
        <Card className="w-full rounded-none border border-white/10 bg-card py-0 shadow-none sm:rounded-[2rem]">
          <CardHeader className="border-b border-white/10 px-4 py-3 sm:px-6 sm:py-5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <CardTitle className="text-lg font-semibold text-white sm:text-2xl">
                  {mode === 'create'
                    ? 'Create watchlist'
                    : `Edit ${watchlist?.title ?? 'watchlist'}`}
                </CardTitle>

                <p className="max-w-xl text-sm leading-6 text-[#d5d0c5] sm:leading-7">
                  Save the watchlist metadata here. TV show items are managed on
                  the watchlist page itself.
                </p>
              </div>

              <Button variant="ghost" size="icon-sm" onClick={onClose}>
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="px-4 py-4 sm:px-6 sm:py-6">
            <form
              className="space-y-4 sm:space-y-5"
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
                    className="h-10 rounded-xl border-white/10 bg-[#2a2c31] px-3 text-sm text-white placeholder:text-muted-foreground focus-visible:border-[#7c6135] focus-visible:ring-0 sm:h-12 sm:rounded-2xl sm:px-4"
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
                    rows={4}
                    aria-invalid={Boolean(errors.description)}
                    placeholder="Optional context about the purpose of this watchlist."
                    className="w-full rounded-xl border border-white/10 bg-[#2a2c31] px-3 py-2 text-sm leading-6 text-white outline-none transition placeholder:text-muted-foreground focus:border-[#7c6135] aria-invalid:border-destructive sm:rounded-[1.4rem] sm:px-4 sm:py-3 sm:leading-7"
                    {...register('description')}
                  />
                  <FieldError
                    errors={[errors.description]}
                    className="text-rose-200"
                  />
                </FieldContent>
              </Field>

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto"
                >
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
