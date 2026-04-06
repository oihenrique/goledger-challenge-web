import { useEffect, useState } from 'react';
import { LoaderCircle, X } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Button,
  Checkbox,
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
  onCreateSuccessNavigate?: (title: string) => void;
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
  onCreateSuccessNavigate,
  onSubmit,
  tvShow,
}: TvShowFormModalProps) {
  const [openAfterCreate, setOpenAfterCreate] = useState(true);

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

    if (mode === 'create' && openAfterCreate) {
      onCreateSuccessNavigate?.(payload.title);
    }
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
        className="max-h-dvh w-full max-w-full overflow-y-auto rounded-none border border-white/10 bg-transparent p-0 ring-0 sm:max-w-2xl sm:rounded-[2rem]"
      >
        <Card className="w-full rounded-none border border-white/10 bg-card py-0 shadow-none sm:rounded-[2rem]">
          {/* HEADER */}
          <CardHeader className="border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div className="space-y-2 sm:space-y-3">
                <div className="space-y-2">
                  <CardTitle className="text-lg font-semibold text-white sm:text-2xl">
                    {heading}
                  </CardTitle>

                  <p className="max-w-xl text-sm leading-6 text-[#d5d0c5] sm:leading-7">
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

          {/* CONTENT */}
          <CardContent className="px-4 py-4 sm:px-6 sm:py-6">
            <form
              className="space-y-4 sm:space-y-5"
              onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)}
            >
              <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
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
                      readOnly={mode === 'edit'}
                      disabled={mode === 'edit'}
                      className="h-10 rounded-xl border-white/10 bg-[#2a2c31] px-3 text-sm text-white placeholder:text-muted-foreground focus-visible:border-[#7c6135] focus-visible:ring-0 sm:h-12 sm:rounded-2xl sm:px-4"
                      {...register('title')}
                    />
                    <FieldError errors={[errors.title]} />
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
                      className="h-10 rounded-xl border-white/10 bg-[#2a2c31] px-3 text-sm text-white placeholder:text-muted-foreground focus-visible:border-[#7c6135] focus-visible:ring-0 sm:h-12 sm:rounded-2xl sm:px-4"
                      {...register('recommendedAge', {
                        valueAsNumber: true,
                      })}
                    />
                    <FieldError errors={[errors.recommendedAge]} />
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
                    rows={5}
                    aria-invalid={Boolean(errors.description)}
                    placeholder="Write a concise synopsis for the public catalog."
                    className="w-full rounded-xl border border-white/10 bg-[#2a2c31] px-3 py-2 text-sm leading-6 text-white outline-none transition placeholder:text-muted-foreground focus:border-[#7c6135] sm:rounded-[1.4rem] sm:px-4 sm:py-3 sm:leading-7"
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
                      id="tv-show-open-manage-page"
                      checked={openAfterCreate}
                      onCheckedChange={(checked) =>
                        setOpenAfterCreate(checked === true)
                      }
                    />
                    <FieldContent>
                      <FieldLabel
                        htmlFor="tv-show-open-manage-page"
                        className="text-sm text-[#d5d0c5]"
                      >
                        Open manage page after create
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
                      {mode === 'create' ? 'Create TV show' : 'Save changes'}
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
