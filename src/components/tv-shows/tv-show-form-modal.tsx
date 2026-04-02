import { useState } from 'react';
import { LoaderCircle, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createTvShowSchema } from '@/modules/tv-shows/schemas/tv-show.schemas';
import type {
  CreateTvShowInput,
  TvShowViewModel,
  UpdateTvShowInput,
} from '@/modules/tv-shows/types/tv-show.types';
import { assetTypes } from '@/shared/types';

type TvShowFormValues = {
  description: string;
  recommendedAge: string;
  title: string;
};

interface TvShowFormModalProps {
  isPending?: boolean;
  mode: 'create' | 'edit';
  onClose: () => void;
  onSubmit: (input: CreateTvShowInput | UpdateTvShowInput) => Promise<void>;
  tvShow?: TvShowViewModel | null;
}

const emptyFormValues: TvShowFormValues = {
  description: '',
  recommendedAge: '',
  title: '',
};

function getInitialValues(
  mode: 'create' | 'edit',
  tvShow?: TvShowViewModel | null,
): TvShowFormValues {
  if (mode === 'edit' && tvShow) {
    return {
      description: tvShow.description,
      recommendedAge: String(tvShow.recommendedAge),
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
  const [formValues, setFormValues] = useState<TvShowFormValues>(
    getInitialValues(mode, tvShow),
  );
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      '@assetType': assetTypes.tvShows,
      description: formValues.description.trim(),
      recommendedAge: Number(formValues.recommendedAge),
      title: formValues.title.trim(),
    };

    const parsedPayload = createTvShowSchema.safeParse(payload);

    if (!parsedPayload.success) {
      setFormError(parsedPayload.error.issues[0]?.message ?? 'Invalid form data.');
      return;
    }

    setFormError(null);
    await onSubmit(parsedPayload.data);
  }

  const heading =
    mode === 'create' ? 'Create TV show' : `Edit ${tvShow?.title ?? 'TV show'}`;
  const subheading =
    mode === 'create'
      ? 'Register a new title in the editorial workspace.'
      : 'Update catalog information while preserving blockchain audit data.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-8">
      <div className="absolute inset-0" aria-hidden="true" onClick={onClose} />
      <Card className="relative z-10 w-full max-w-2xl rounded-[2rem] border border-white/10 bg-card py-0 shadow-none">
        <CardHeader className="border-b border-white/10 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex w-fit rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Editorial form
              </div>
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
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-[1.2fr_0.55fr]">
              <label className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Title
                </span>
                <input
                  value={formValues.title}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Enter the series title"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-[#2a2c31] px-4 text-sm text-white outline-none transition placeholder:text-muted-foreground focus:border-[#7c6135]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Recommended age
                </span>
                <input
                  type="number"
                  min={1}
                  value={formValues.recommendedAge}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      recommendedAge: event.target.value,
                    }))
                  }
                  placeholder="16"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-[#2a2c31] px-4 text-sm text-white outline-none transition placeholder:text-muted-foreground focus:border-[#7c6135]"
                />
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Synopsis
              </span>
              <textarea
                rows={6}
                value={formValues.description}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Write a concise synopsis for the public catalog."
                className="w-full rounded-[1.4rem] border border-white/10 bg-[#2a2c31] px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-muted-foreground focus:border-[#7c6135]"
              />
            </label>

            {formError ? (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 px-4 py-3">
                <p className="text-sm text-rose-200">{formError}</p>
              </div>
            ) : null}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : null}
                <span>{mode === 'create' ? 'Create TV show' : 'Save changes'}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
