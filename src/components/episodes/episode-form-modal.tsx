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
  Checkbox,
  Dialog,
  DialogContent,
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  Input,
} from '@/components/ui';
import { toDateInputValue, toIsoDateTimeFromDateInput } from '@/lib/date';
import type {
  CreateEpisodeInput,
  EpisodeViewModel,
  UpdateEpisodeInput,
} from '@/modules/episodes/types/episode.types';
import type { SeasonViewModel } from '@/modules/seasons/types/season.types';
import type { TvShowViewModel } from '@/modules/tv-shows/types/tv-show.types';
import { assetTypes } from '@/shared/types';

const episodeFormSchema = z.object({
  description: z.string().min(1).max(500),
  episodeNumber: z.number().int().positive(),
  rating: z.number().finite().min(0).max(10).optional(),
  releaseDate: z.string().min(1, 'Release date is required'),
  title: z.string().min(1).max(255),
});

type EpisodeFormValues = z.infer<typeof episodeFormSchema>;

interface EpisodeFormModalProps {
  isPending?: boolean;
  mode: 'create' | 'edit';
  onClose: () => void;
  onSubmit: (
    input: CreateEpisodeInput | UpdateEpisodeInput,
    options?: { createAnother?: boolean },
  ) => Promise<void>;
  episode?: EpisodeViewModel | null;
  season: SeasonViewModel;
  tvShow: TvShowViewModel;
}

const emptyFormValues: EpisodeFormValues = {
  description: '',
  episodeNumber: 1,
  rating: undefined,
  releaseDate: '',
  title: '',
};

function getInitialValues(
  mode: 'create' | 'edit',
  episode?: EpisodeViewModel | null,
): EpisodeFormValues {
  if (mode === 'edit' && episode) {
    return {
      description: episode.description,
      episodeNumber: episode.episodeNumber,
      rating: episode.rating,
      releaseDate: toDateInputValue(episode.releaseDate),
      title: episode.title,
    };
  }

  return emptyFormValues;
}

export function EpisodeFormModal({
  isPending = false,
  mode,
  onClose,
  onSubmit,
  episode,
  season,
  tvShow,
}: EpisodeFormModalProps) {
  const [createAnother, setCreateAnother] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<EpisodeFormValues>({
    defaultValues: getInitialValues(mode, episode),
    resolver: zodResolver(episodeFormSchema),
  });

  useEffect(() => {
    reset(getInitialValues(mode, episode));
  }, [episode, mode, reset]);

  async function handleFormSubmit(values: EpisodeFormValues) {
    const releaseDate = toIsoDateTimeFromDateInput(values.releaseDate);

    if (!releaseDate) {
      return;
    }

    const payload: CreateEpisodeInput | UpdateEpisodeInput = {
      '@assetType': assetTypes.episodes,
      description: values.description.trim(),
      episodeNumber: values.episodeNumber,
      rating: values.rating,
      releaseDate,
      season: {
        '@assetType': assetTypes.seasons,
        '@key': season.key,
      },
      title: values.title.trim(),
    };

    await onSubmit(payload, {
      createAnother: mode === 'create' && createAnother,
    });

    if (mode === 'create' && createAnother) {
      reset(emptyFormValues);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-transparent p-0 ring-0 sm:max-w-2xl"
      >
        <Card className="w-full rounded-[2rem] border border-white/10 bg-card py-0 shadow-none">
          <CardHeader className="border-b border-white/10 px-6 py-5">
            <div className="space-y-3">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-semibold text-white">
                  {mode === 'create'
                    ? `Create episode for season ${season.number}`
                    : `Edit episode ${episode?.episodeNumber ?? ''}`}
                </CardTitle>
                <p className="max-w-xl text-sm leading-7 text-[#d5d0c5]">
                  This episode will stay inside season{' '}
                  <span className="font-medium text-white">
                    {season.number}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium text-white">{tvShow.title}</span>
                  .
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 px-6 py-6">
            <div className="rounded-2xl border border-white/10 bg-[#2a2c31] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Active context
              </p>
              <p className="mt-2 text-sm text-[#ebe5d8]">
                {tvShow.title} · Season {season.number}
              </p>
            </div>

            <form
              className="space-y-5"
              onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel
                    htmlFor="episode-number"
                    className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    Episode number
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="episode-number"
                      type="number"
                      min={1}
                      aria-invalid={Boolean(errors.episodeNumber)}
                      className="h-12 rounded-2xl border-white/10 bg-[#2a2c31] px-4 text-sm text-white placeholder:text-muted-foreground focus-visible:border-[#7c6135] focus-visible:ring-0"
                      {...register('episodeNumber', { valueAsNumber: true })}
                    />
                    <FieldError
                      errors={[errors.episodeNumber]}
                      className="text-rose-200"
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="episode-rating"
                    className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    Rating
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="episode-rating"
                      type="number"
                      min={0}
                      max={10}
                      step="0.1"
                      aria-invalid={Boolean(errors.rating)}
                      className="h-12 rounded-2xl border-white/10 bg-[#2a2c31] px-4 text-sm text-white placeholder:text-muted-foreground focus-visible:border-[#7c6135] focus-visible:ring-0"
                      {...register('rating', {
                        setValueAs: (value) =>
                          value === '' ? undefined : Number(value),
                      })}
                    />
                    <FieldError
                      errors={[errors.rating]}
                      className="text-rose-200"
                    />
                  </FieldContent>
                </Field>
              </div>

              <Field>
                <FieldLabel
                  htmlFor="episode-title"
                  className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                >
                  Title
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="episode-title"
                    aria-invalid={Boolean(errors.title)}
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
                <FieldLabel
                  htmlFor="episode-release-date"
                  className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                >
                  Release date
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="episode-release-date"
                    type="date"
                    aria-invalid={Boolean(errors.releaseDate)}
                    className="h-12 rounded-2xl border-white/10 bg-[#2a2c31] px-4 text-sm text-white placeholder:text-muted-foreground focus-visible:border-[#7c6135] focus-visible:ring-0"
                    {...register('releaseDate')}
                  />
                  <FieldError
                    errors={[errors.releaseDate]}
                    className="text-rose-200"
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="episode-description"
                  className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                >
                  Description
                </FieldLabel>
                <FieldContent>
                  <textarea
                    id="episode-description"
                    rows={5}
                    aria-invalid={Boolean(errors.description)}
                    className="w-full rounded-[1.4rem] border border-white/10 bg-[#2a2c31] px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-muted-foreground focus:border-[#7c6135] aria-invalid:border-destructive"
                    {...register('description')}
                  />
                  <FieldError
                    errors={[errors.description]}
                    className="text-rose-200"
                  />
                </FieldContent>
              </Field>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                {mode === 'create' ? (
                  <Field
                    orientation="horizontal"
                    className="items-center gap-2"
                  >
                    <Checkbox
                      id="episode-create-another"
                      checked={createAnother}
                      onCheckedChange={(checked) =>
                        setCreateAnother(checked === true)
                      }
                      className="border-white/20 bg-[#2a2c31] data-checked:border-[#b58d47] data-checked:bg-[#b58d47] data-checked:text-black"
                    />
                    <FieldContent>
                      <FieldLabel
                        htmlFor="episode-create-another"
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
                      {mode === 'create' ? 'Create episode' : 'Save changes'}
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
