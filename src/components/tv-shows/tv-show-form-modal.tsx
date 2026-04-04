import { useEffect } from 'react';
import { LoaderCircle, X } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Button,
  Dialog,
  DialogContent,
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  Input,
} from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { createTvShowSchema } from '@/modules/tv-shows/schemas/tv-show.schemas';
import type {
  CreateTvShowInput,
  TvShowViewModel,
  UpdateTvShowInput,
} from '@/modules/tv-shows/types/tv-show.types';
import { assetTypes } from '@/shared/types';

const tvShowFormSchema = createTvShowSchema.omit({
  '@assetType': true,
});

type TvShowFormValues = z.infer<typeof tvShowFormSchema>;

interface TvShowFormModalProps {
  isPending?: boolean;
  mode: 'create' | 'edit';
  onClose: () => void;
  onSubmit: (input: CreateTvShowInput | UpdateTvShowInput) => Promise<void>;
  tvShow?: TvShowViewModel | null;
}

const emptyFormValues: TvShowFormValues = {
  description: '',
  recommendedAge: 0,
  title: '',
};

function getInitialValues(
  mode: 'create' | 'edit',
  tvShow?: TvShowViewModel | null,
): TvShowFormValues {
  if (mode === 'edit' && tvShow) {
    return {
      description: tvShow.description,
      recommendedAge: tvShow.recommendedAge,
      title: tvShow.title,
    };
  }

  return emptyFormValues;
}

export function TvShowFormModal({
  isPending = false,
  mode,
  onClose,
  onSubmit,
  tvShow,
}: TvShowFormModalProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<TvShowFormValues>({
    defaultValues: getInitialValues(mode, tvShow),
    resolver: zodResolver(tvShowFormSchema),
  });

  useEffect(() => {
    reset(getInitialValues(mode, tvShow));
  }, [mode, reset, tvShow]);

  async function handleFormSubmit(values: TvShowFormValues) {
    const payload: CreateTvShowInput | UpdateTvShowInput = {
      '@assetType': assetTypes.tvShows,
      description: values.description.trim(),
      recommendedAge: values.recommendedAge,
      title: values.title.trim(),
    };

    await onSubmit(payload);
  }

  const heading =
    mode === 'create' ? 'Create TV show' : `Edit ${tvShow?.title ?? 'TV show'}`;
  const subheading =
    mode === 'create'
      ? 'Register a new title in the our catalog.'
      : 'Update catalog information while preserving blockchain audit data.';

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
                    {heading}
                  </CardTitle>
                  <p className="max-w-xl text-sm leading-7 text-[#d5d0c5]">
                    {subheading}
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
              <div className="grid gap-5 sm:grid-cols-[1.2fr_0.55fr]">
                <Field>
                  <FieldLabel
                    htmlFor="tv-show-title"
                    className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    Title
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="tv-show-title"
                      aria-invalid={Boolean(errors.title)}
                      placeholder="Enter the series title"
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
                    htmlFor="tv-show-recommended-age"
                    className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    Recommended age
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="tv-show-recommended-age"
                      aria-invalid={Boolean(errors.recommendedAge)}
                      type="number"
                      min={1}
                      placeholder="16"
                      className="h-12 rounded-2xl border-white/10 bg-[#2a2c31] px-4 text-sm text-white placeholder:text-muted-foreground focus-visible:border-[#7c6135] focus-visible:ring-0"
                      {...register('recommendedAge', {
                        valueAsNumber: true,
                      })}
                    />
                    <FieldError
                      errors={[errors.recommendedAge]}
                      className="text-rose-200"
                    />
                  </FieldContent>
                </Field>
              </div>

              <Field>
                <FieldLabel
                  htmlFor="tv-show-description"
                  className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                >
                  Synopsis
                </FieldLabel>
                <FieldContent>
                  <textarea
                    id="tv-show-description"
                    rows={6}
                    aria-invalid={Boolean(errors.description)}
                    placeholder="Write a concise synopsis for the public catalog."
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
                    {mode === 'create' ? 'Create TV show' : 'Save changes'}
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
