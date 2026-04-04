import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
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
import { createSeasonSchema } from '@/modules/seasons/schemas/season.schemas';
import type {
  CreateSeasonInput,
  SeasonViewModel,
  UpdateSeasonInput,
} from '@/modules/seasons/types/season.types';
import type { TvShowViewModel } from '@/modules/tv-shows/types/tv-show.types';
import { assetTypes } from '@/shared/types';

const seasonFormSchema = createSeasonSchema.omit({
  '@assetType': true,
  tvShow: true,
});

type SeasonFormValues = z.infer<typeof seasonFormSchema>;

interface SeasonFormModalProps {
  isPending?: boolean;
  mode: 'create' | 'edit';
  onClose: () => void;
  onSubmit: (
    input: CreateSeasonInput | UpdateSeasonInput,
    options?: { createAnother?: boolean },
  ) => Promise<void>;
  season?: SeasonViewModel | null;
  tvShow: TvShowViewModel;
}

const emptyFormValues: SeasonFormValues = {
  number: 1,
  year: new Date().getFullYear(),
};

function getInitialValues(
  mode: 'create' | 'edit',
  season?: SeasonViewModel | null,
): SeasonFormValues {
  if (mode === 'edit' && season) {
    return {
      number: season.number,
      year: season.year,
    };
  }

  return emptyFormValues;
}

export function SeasonFormModal({
  isPending = false,
  mode,
  onClose,
  onSubmit,
  season,
  tvShow,
}: SeasonFormModalProps) {
  const [createAnother, setCreateAnother] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<SeasonFormValues>({
    defaultValues: getInitialValues(mode, season),
    resolver: zodResolver(seasonFormSchema),
  });

  useEffect(() => {
    reset(getInitialValues(mode, season));
  }, [mode, reset, season]);

  async function handleFormSubmit(values: SeasonFormValues) {
    const payload: CreateSeasonInput | UpdateSeasonInput = {
      '@assetType': assetTypes.seasons,
      number: values.number,
      tvShow: {
        '@assetType': assetTypes.tvShows,
        '@key': tvShow.key,
      },
      year: values.year,
    };

    await onSubmit(payload, {
      createAnother: mode === 'create' && createAnother,
    });

    if (mode === 'create' && createAnother) {
      reset(emptyFormValues);
    }
  }

  const heading =
    mode === 'create'
      ? `Create season for ${tvShow.title}`
      : `Edit season ${season?.number ?? ''}`;

  return (
    <Dialog open onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-transparent p-0 ring-0 sm:max-w-xl"
      >
        <Card className="w-full rounded-[2rem] border border-white/10 bg-card py-0 shadow-none">
          <CardHeader className="border-b border-white/10 px-6 py-5">
            <div className="space-y-3">
              <div className="inline-flex w-fit rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Season form
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-semibold text-white">
                  {heading}
                </CardTitle>
                <p className="max-w-xl text-sm leading-7 text-[#d5d0c5]">
                  This season will be linked directly to{' '}
                  <span className="font-medium text-white">{tvShow.title}</span>
                  .
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 px-6 py-6">
            <div className="rounded-2xl border border-white/10 bg-[#2a2c31] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                TV show context
              </p>
              <p className="mt-2 text-sm text-[#ebe5d8]">{tvShow.title}</p>
            </div>

            <form
              className="space-y-5"
              onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel
                    htmlFor="season-number"
                    className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    Season number
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="season-number"
                      type="number"
                      min={1}
                      aria-invalid={Boolean(errors.number)}
                      className="h-12 rounded-2xl border-white/10 bg-[#2a2c31] px-4 text-sm text-white placeholder:text-muted-foreground focus-visible:border-[#7c6135] focus-visible:ring-0"
                      {...register('number', { valueAsNumber: true })}
                    />
                    <FieldError errors={[errors.number]} className="text-rose-200" />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="season-year"
                    className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    Release year
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="season-year"
                      type="number"
                      min={1900}
                      max={2100}
                      aria-invalid={Boolean(errors.year)}
                      className="h-12 rounded-2xl border-white/10 bg-[#2a2c31] px-4 text-sm text-white placeholder:text-muted-foreground focus-visible:border-[#7c6135] focus-visible:ring-0"
                      {...register('year', { valueAsNumber: true })}
                    />
                    <FieldError errors={[errors.year]} className="text-rose-200" />
                  </FieldContent>
                </Field>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                {mode === 'create' ? (
                  <Field orientation="horizontal" className="items-center gap-2">
                    <input
                      id="season-create-another"
                      type="checkbox"
                      checked={createAnother}
                      onChange={(event) => setCreateAnother(event.target.checked)}
                      className="size-4 rounded border border-white/20 bg-[#2a2c31] accent-[#b58d47]"
                    />
                    <FieldContent>
                      <FieldLabel
                        htmlFor="season-create-another"
                        className="text-sm text-[#d5d0c5]"
                      >
                        Create another
                      </FieldLabel>
                    </FieldContent>
                  </Field>
                ) : (
                  <div />
                )}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : null}
                    <span>
                      {mode === 'create' ? 'Create season' : 'Save changes'}
                    </span>
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
