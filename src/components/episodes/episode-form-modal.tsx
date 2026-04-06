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

    if (!releaseDate) return;

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
        showCloseButton={true}
        className="max-h-dvh w-full max-w-full overflow-y-auto rounded-none border border-white/10 bg-transparent p-0 ring-0 sm:max-w-2xl sm:rounded-[2rem]"
      >
        <Card className="w-full rounded-none border border-white/10 bg-card py-0 shadow-none sm:rounded-[2rem]">
          <CardHeader className="border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
            <div className="space-y-3">
              <CardTitle className="text-lg font-semibold text-white sm:text-2xl">
                {mode === 'create'
                  ? `Create episode for season ${season.number}`
                  : `Edit episode ${episode?.episodeNumber ?? ''}`}
              </CardTitle>

              <p className="max-w-xl text-sm leading-6 text-[#d5d0c5] sm:leading-7">
                This episode will stay inside season{' '}
                <span className="font-medium text-white">{season.number}</span>{' '}
                of{' '}
                <span className="font-medium text-white">{tvShow.title}</span>.
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-6 sm:py-6">
            <div className="rounded-xl border border-white/10 bg-[#2a2c31] px-3 py-3 sm:rounded-2xl sm:px-4 sm:py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Active context
              </p>
              <p className="mt-2 text-sm text-[#ebe5d8]">
                {tvShow.title} · Season {season.number}
              </p>
            </div>

            <form
              className="space-y-4 sm:space-y-5"
              onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)}
            >
              <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
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
                      className="h-10 rounded-xl border-white/10 bg-[#2a2c31] px-3 text-sm text-white placeholder:text-muted-foreground focus-visible:border-[#7c6135] focus-visible:ring-0 sm:h-12 sm:rounded-2xl sm:px-4"
                      {...register('episodeNumber', { valueAsNumber: true })}
                    />
                    <FieldError errors={[errors.episodeNumber]} />
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
                      className="h-10 rounded-xl border-white/10 bg-[#2a2c31] px-3 text-sm text-white placeholder:text-muted-foreground focus-visible:border-[#7c6135] focus-visible:ring-0 sm:h-12 sm:rounded-2xl sm:px-4"
                      {...register('rating', {
                        setValueAs: (value) =>
                          value === '' ? undefined : Number(value),
                      })}
                    />
                    <FieldError errors={[errors.rating]} />
                  </FieldContent>
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="episode-title">Title</FieldLabel>
                <FieldContent>
                  <Input
                    id="episode-title"
                    aria-invalid={Boolean(errors.title)}
                    className="h-10 rounded-xl border-white/10 bg-[#2a2c31] px-3 text-sm text-white sm:h-12 sm:rounded-2xl sm:px-4"
                    {...register('title')}
                  />
                  <FieldError errors={[errors.title]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="episode-release-date">
                  Release date
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="episode-release-date"
                    type="date"
                    aria-invalid={Boolean(errors.releaseDate)}
                    className="h-10 rounded-xl border-white/10 bg-[#2a2c31] px-3 text-sm text-white sm:h-12 sm:rounded-2xl sm:px-4"
                    {...register('releaseDate')}
                  />
                  <FieldError errors={[errors.releaseDate]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="episode-description">
                  Description
                </FieldLabel>
                <FieldContent>
                  <textarea
                    id="episode-description"
                    rows={4}
                    aria-invalid={Boolean(errors.description)}
                    className="w-full rounded-xl border border-white/10 bg-[#2a2c31] px-3 py-2 text-sm leading-6 text-white sm:rounded-[1.4rem] sm:px-4 sm:py-3 sm:leading-7"
                    {...register('description')}
                  />
                  <FieldError errors={[errors.description]} />
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

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
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
