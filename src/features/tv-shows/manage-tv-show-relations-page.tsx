import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft, Film, Layers2, Plus, Video } from 'lucide-react';
import { toast } from 'sonner';

import { EpisodeDeleteDialog } from '@/components/episodes/episode-delete-dialog';
import { EpisodeDetailsModal } from '@/components/episodes/episode-details-modal';
import { EpisodeFormModal } from '@/components/episodes/episode-form-modal';
import { SeasonDeleteDialog } from '@/components/seasons/season-delete-dialog';
import { SeasonDetailsModal } from '@/components/seasons/season-details-modal';
import { SeasonFormModal } from '@/components/seasons/season-form-modal';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  Skeleton,
} from '@/components/ui';
import { PageShell } from '@/layout/page-shell';
import { formatDate } from '@/lib/date';
import { InternalApiError } from '@/lib/api/internal-api-client';
import {
  useCreateEpisode,
  useDeleteEpisode,
  useUpdateEpisode,
} from '@/modules/episodes/hooks/use-episode-mutations';
import { useEpisodes } from '@/modules/episodes/hooks/use-episodes';
import type {
  CreateEpisodeInput,
  EpisodeViewModel,
  UpdateEpisodeInput,
} from '@/modules/episodes/types/episode.types';
import {
  useCreateSeason,
  useDeleteSeason,
  useUpdateSeason,
} from '@/modules/seasons/hooks/use-season-mutations';
import { useSeasons } from '@/modules/seasons/hooks/use-seasons';
import type {
  CreateSeasonInput,
  SeasonRelationViewModel,
  SeasonViewModel,
  UpdateSeasonInput,
} from '@/modules/seasons/types/season.types';
import { useTvShow } from '@/modules/tv-shows/hooks/use-tv-show';
import {
  getOrderedTvShowSeasons,
  mapEpisodesToRelationViewModels,
  resolveActiveSeason,
} from '@/modules/tv-shows/utils/tv-show-relations';
import { assetTypes } from '@/shared/types';

interface ManageTvShowRelationsPageProps {
  title: string;
}

const relationBatchLimit = 100;
const episodesPerPage = 10;

function getMutationErrorMessage(error: unknown, fallback: string) {
  if (error instanceof InternalApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function ManageTvShowRelationsPage({
  title,
}: ManageTvShowRelationsPageProps) {
  const tvShowQuery = useTvShow({
    '@assetType': assetTypes.tvShows,
    title,
  });
  const seasonsQuery = useSeasons(
    {
      limit: relationBatchLimit,
      tvShowKey: tvShowQuery.data?.key,
    },
    { enabled: Boolean(tvShowQuery.data?.key) },
  );
  const createSeasonMutation = useCreateSeason();
  const updateSeasonMutation = useUpdateSeason();
  const deleteSeasonMutation = useDeleteSeason();
  const createEpisodeMutation = useCreateEpisode();
  const updateEpisodeMutation = useUpdateEpisode();
  const deleteEpisodeMutation = useDeleteEpisode();

  const [selectedSeasonKey, setSelectedSeasonKey] = useState<string | null>(
    null,
  );
  const [seasonFormMode, setSeasonFormMode] = useState<
    'create' | 'edit' | null
  >(null);
  const [seasonInFocus, setSeasonInFocus] = useState<SeasonViewModel | null>(
    null,
  );
  const [seasonPendingDeletion, setSeasonPendingDeletion] =
    useState<SeasonViewModel | null>(null);
  const [seasonInDetails, setSeasonInDetails] =
    useState<SeasonViewModel | null>(null);
  const [episodeFormMode, setEpisodeFormMode] = useState<
    'create' | 'edit' | null
  >(null);
  const [episodeInFocus, setEpisodeInFocus] = useState<EpisodeViewModel | null>(
    null,
  );
  const [episodePendingDeletion, setEpisodePendingDeletion] =
    useState<EpisodeViewModel | null>(null);
  const [episodeInDetails, setEpisodeInDetails] =
    useState<EpisodeViewModel | null>(null);
  const [currentEpisodePage, setCurrentEpisodePage] = useState(1);

  const tvShow = tvShowQuery.data ?? null;
  const seasons = getOrderedTvShowSeasons(
    seasonsQuery.data?.items ?? [],
    tvShow,
  );
  const selectedSeason = resolveActiveSeason(seasons, selectedSeasonKey);
  const activeSeasonKey = selectedSeason?.key ?? null;

  const episodesQuery = useEpisodes(
    {
      seasonKey: activeSeasonKey ?? undefined,
    },
    { enabled: Boolean(activeSeasonKey) },
  );
  const allEpisodes = mapEpisodesToRelationViewModels(
    episodesQuery.data?.items ?? [],
    selectedSeason,
    tvShow,
  );
  const totalEpisodePages = Math.max(
    1,
    Math.ceil(allEpisodes.length / episodesPerPage),
  );
  const safeCurrentEpisodePage = Math.min(
    currentEpisodePage,
    totalEpisodePages,
  );
  const episodes = allEpisodes.slice(
    (safeCurrentEpisodePage - 1) * episodesPerPage,
    safeCurrentEpisodePage * episodesPerPage,
  );

  const seasonEpisodesCount = selectedSeason ? allEpisodes.length : 0;
  const hasPreviousEpisodePage = safeCurrentEpisodePage > 1;
  const hasNextEpisodePage = safeCurrentEpisodePage < totalEpisodePages;
  const showEpisodeEmptyState =
    selectedSeason &&
    !episodesQuery.isLoading &&
    !episodesQuery.isError &&
    allEpisodes.length === 0;

  const isSeasonFormPending =
    createSeasonMutation.isPending || updateSeasonMutation.isPending;
  const isEpisodeFormPending =
    createEpisodeMutation.isPending || updateEpisodeMutation.isPending;

  function openCreateSeasonModal() {
    setSeasonInFocus(null);
    setSeasonFormMode('create');
  }

  function openEditSeasonModal(season: SeasonRelationViewModel) {
    setSeasonInFocus(season);
    setSeasonFormMode('edit');
  }

  function closeSeasonFormModal() {
    setSeasonFormMode(null);
    setSeasonInFocus(null);
  }

  function openCreateEpisodeModal() {
    setEpisodeInFocus(null);
    setEpisodeFormMode('create');
  }

  function handleSeasonSelection(seasonKey: string) {
    setSelectedSeasonKey(seasonKey);
    setCurrentEpisodePage(1);
  }

  function handleNextEpisodePage() {
    if (!hasNextEpisodePage) {
      return;
    }

    setCurrentEpisodePage((page) => page + 1);
  }

  function handlePreviousEpisodePage() {
    if (!hasPreviousEpisodePage) {
      return;
    }

    setCurrentEpisodePage((page) => Math.max(1, page - 1));
  }

  function openEditEpisodeModal(episode: EpisodeViewModel) {
    setEpisodeInFocus(episode);
    setEpisodeFormMode('edit');
  }

  function closeEpisodeFormModal() {
    setEpisodeFormMode(null);
    setEpisodeInFocus(null);
  }

  async function handleSeasonSubmit(
    input: CreateSeasonInput | UpdateSeasonInput,
    options?: { createAnother?: boolean },
  ) {
    try {
      if (seasonFormMode === 'edit') {
        const updatedSeason = await updateSeasonMutation.mutateAsync(input);
        setSelectedSeasonKey(updatedSeason.key);
        setCurrentEpisodePage(1);
        toast.success(`Updated season ${updatedSeason.number}.`);
      } else {
        const createdSeasons = await createSeasonMutation.mutateAsync(input);
        const createdSeason = createdSeasons[0];

        if (createdSeason) {
          setSelectedSeasonKey(createdSeason.key);
          setCurrentEpisodePage(1);
          toast.success(`Created season ${createdSeason.number}.`);
        }
      }

      if (!(seasonFormMode === 'create' && options?.createAnother)) {
        closeSeasonFormModal();
      }
    } catch (mutationError) {
      toast.error(
        getMutationErrorMessage(
          mutationError,
          seasonFormMode === 'edit'
            ? 'Unable to update this season.'
            : 'Unable to create this season.',
        ),
      );
    }
  }

  async function handleEpisodeSubmit(
    input: CreateEpisodeInput | UpdateEpisodeInput,
    options?: { createAnother?: boolean },
  ) {
    try {
      if (episodeFormMode === 'edit') {
        const updatedEpisode = await updateEpisodeMutation.mutateAsync(input);
        toast.success(`Updated episode ${updatedEpisode.episodeNumber}.`);
      } else {
        const createdEpisodes = await createEpisodeMutation.mutateAsync(input);
        const createdEpisode = createdEpisodes[0];

        if (createdEpisode) {
          setCurrentEpisodePage(1);
          toast.success(`Created episode ${createdEpisode.episodeNumber}.`);
        }
      }

      if (!(episodeFormMode === 'create' && options?.createAnother)) {
        closeEpisodeFormModal();
      }
    } catch (mutationError) {
      toast.error(
        getMutationErrorMessage(
          mutationError,
          episodeFormMode === 'edit'
            ? 'Unable to update this episode.'
            : 'Unable to create this episode.',
        ),
      );
    }
  }

  async function handleSeasonDelete() {
    if (!seasonPendingDeletion) {
      return;
    }

    try {
      await deleteSeasonMutation.mutateAsync({
        '@assetType': assetTypes.seasons,
        number: seasonPendingDeletion.number,
        tvShow: {
          '@assetType': assetTypes.tvShows,
          '@key': seasonPendingDeletion.tvShowKey,
        },
      });
      toast.success(`Deleted season ${seasonPendingDeletion.number}.`);
      setSeasonPendingDeletion(null);
    } catch (mutationError) {
      toast.error(
        getMutationErrorMessage(mutationError, 'Unable to delete this season.'),
      );
    }
  }

  async function handleEpisodeDelete() {
    if (!episodePendingDeletion || !selectedSeason) {
      return;
    }

    try {
      await deleteEpisodeMutation.mutateAsync({
        '@assetType': assetTypes.episodes,
        episodeNumber: episodePendingDeletion.episodeNumber,
        season: {
          '@assetType': assetTypes.seasons,
          '@key': selectedSeason.key,
        },
      });
      if (safeCurrentEpisodePage > 1 && episodes.length === 1) {
        setCurrentEpisodePage((page) => Math.max(1, page - 1));
      }
      toast.success(`Deleted episode ${episodePendingDeletion.episodeNumber}.`);
      setEpisodePendingDeletion(null);
    } catch (mutationError) {
      toast.error(
        getMutationErrorMessage(
          mutationError,
          'Unable to delete this episode.',
        ),
      );
    }
  }

  const pageTitle = tvShow ? `${tvShow.title}` : 'TV show';

  return (
    <>
      <PageShell>
        <section className="space-y-8 py-14 sm:py-16">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/manage/tv-shows">
                <ChevronLeft className="size-4" />
                <span>Back to TV shows</span>
              </Link>
            </Button>
            {tvShow ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/tv-shows/${encodeURIComponent(tvShow.title)}`}>
                  <span>Open public detail</span>
                </Link>
              </Button>
            ) : null}
          </div>

          {tvShowQuery.isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-14 w-1/2 bg-[#31343a]" />
              <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
                <Skeleton className="h-105 w-full rounded-3xl bg-[#2a2c31]" />
                <Skeleton className="h-105 w-full rounded-3xl bg-[#2a2c31]" />
              </div>
            </div>
          ) : null}

          {tvShowQuery.isError ? (
            <div className="rounded-3xl border border-rose-500/30 bg-rose-950/20 p-6">
              <p className="text-sm font-medium text-rose-200">
                Unable to load this TV show workspace.
              </p>
              <p className="mt-2 text-sm text-rose-100/80">
                {tvShowQuery.error instanceof Error
                  ? tvShowQuery.error.message
                  : 'An unexpected error happened while loading the relation workspace.'}
              </p>
            </div>
          ) : null}

          {!tvShowQuery.isLoading && !tvShowQuery.isError && tvShow ? (
            <>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-4">
                  <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    Manage seasons and episodes for {tvShow.title}.
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-[#d5d0c5]">
                    Keep the active TV show context fixed while you organize
                    seasons on the left and manage the selected season episodes
                    on the right.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
                <Card className="min-w-0 rounded-3xl border border-white/10 bg-card py-0 shadow-none">
                  <CardHeader className="border-b border-white/10 px-5 py-5">
                    <div className="space-y-3">
                      <div className="inline-flex w-fit rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                        Seasons
                      </div>
                      <CardTitle className="text-lg font-semibold text-white">
                        {pageTitle}
                      </CardTitle>
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={openCreateSeasonModal}
                      >
                        <Plus className="size-4" />
                        <span>Create season</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 py-4">
                    {seasonsQuery.isLoading ? (
                      <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Skeleton
                            key={index}
                            className="h-16 w-full rounded-2xl bg-[#2a2c31]"
                          />
                        ))}
                      </div>
                    ) : null}

                    {seasonsQuery.isError ? (
                      <div className="rounded-2xl border border-rose-500/20 bg-rose-950/20 px-4 py-4">
                        <p className="text-sm font-medium text-rose-200">
                          Unable to load seasons.
                        </p>
                        <p className="mt-2 text-sm text-rose-100/80">
                          {seasonsQuery.error instanceof Error
                            ? seasonsQuery.error.message
                            : 'An unexpected error happened while loading seasons.'}
                        </p>
                      </div>
                    ) : null}

                    {!seasonsQuery.isLoading &&
                    !seasonsQuery.isError &&
                    seasons.length === 0 ? (
                      <Empty className="rounded-2xl border border-dashed border-white/10 bg-[#1c1d21] p-8">
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <Layers2 />
                          </EmptyMedia>
                          <EmptyTitle className="text-white">
                            No seasons created yet
                          </EmptyTitle>
                          <EmptyDescription className="text-[#d5d0c5]">
                            Create the first season for this TV show to start
                            organizing episodes.
                          </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                          <Button onClick={openCreateSeasonModal}>
                            <Plus className="size-4" />
                            <span>Create season</span>
                          </Button>
                        </EmptyContent>
                      </Empty>
                    ) : null}

                    {!seasonsQuery.isLoading &&
                    !seasonsQuery.isError &&
                    seasons.length > 0 ? (
                      <div className="space-y-3">
                        {seasons.map((season) => {
                          const isActive = season.key === selectedSeason?.key;

                          return (
                            <button
                              key={season.key}
                              type="button"
                              aria-pressed={isActive}
                              aria-label={`Select season ${season.number}`}
                              onClick={() => handleSeasonSelection(season.key)}
                              className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                                isActive
                                  ? 'border-[#7c6135] bg-[#2a2c31]'
                                  : 'border-white/10 bg-[#1c1d21] hover:bg-[#2a2c31]'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-sm font-medium text-white">
                                    Season {season.number}
                                  </p>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    Release year {season.year}
                                  </p>
                                </div>
                                {isActive ? (
                                  <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[#d5d0c5]">
                                    Active
                                  </span>
                                ) : null}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>

                <div className="min-w-0 space-y-6">
                  {!selectedSeason &&
                  !seasonsQuery.isLoading &&
                  !seasonsQuery.isError ? (
                    <Card className="min-w-0 rounded-3xl border border-white/10 bg-card py-0 shadow-none">
                      <CardContent className="px-6 py-10">
                        <Empty className="rounded-2xl border border-dashed border-white/10 bg-[#1c1d21] p-10">
                          <EmptyHeader>
                            <EmptyMedia variant="icon">
                              <Film />
                            </EmptyMedia>
                            <EmptyTitle className="text-white">
                              Start by creating a season
                            </EmptyTitle>
                            <EmptyDescription className="text-[#d5d0c5]">
                              Episodes are managed inside a selected season, so
                              the first step is to create one for this TV show.
                            </EmptyDescription>
                          </EmptyHeader>
                          <EmptyContent>
                            <Button onClick={openCreateSeasonModal}>
                              <Plus className="size-4" />
                              <span>Create season</span>
                            </Button>
                          </EmptyContent>
                        </Empty>
                      </CardContent>
                    </Card>
                  ) : null}

                  {selectedSeason ? (
                    <Card className="min-w-0 rounded-3xl border border-white/10 bg-card py-0 shadow-none">
                      <CardHeader className="border-b border-white/10 px-6 py-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="space-y-3">
                            <div className="inline-flex w-fit rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                              Active season
                            </div>
                            <div className="space-y-2">
                              <CardTitle className="text-2xl font-semibold text-white">
                                Season {selectedSeason.number}
                              </CardTitle>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <Button
                              variant="outline"
                              onClick={() => setSeasonInDetails(selectedSeason)}
                            >
                              Details
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() =>
                                openEditSeasonModal(selectedSeason)
                              }
                            >
                              Edit season
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() =>
                                setSeasonPendingDeletion(selectedSeason)
                              }
                            >
                              Delete season
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ) : null}

                  {selectedSeason ? (
                    <Card className="min-w-0 rounded-3xl border border-white/10 bg-card py-0 shadow-none">
                      <CardHeader className="border-b border-white/10 px-6 py-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="space-y-3">
                            <div className="inline-flex w-fit rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                              Episodes
                            </div>
                          </div>
                          <Button onClick={openCreateEpisodeModal}>
                            <Plus className="size-4" />
                            <span>Create episode</span>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="px-0 py-0">
                        {episodesQuery.isLoading ? (
                          <div className="space-y-3 px-6 py-6">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Skeleton
                                key={index}
                                className="h-14 w-full rounded-2xl bg-[#2a2c31]"
                              />
                            ))}
                          </div>
                        ) : null}

                        {episodesQuery.isError ? (
                          <div className="px-6 py-6">
                            <div className="rounded-2xl border border-rose-500/20 bg-rose-950/20 px-4 py-4">
                              <p className="text-sm font-medium text-rose-200">
                                Unable to load episodes for this season.
                              </p>
                              <p className="mt-2 text-sm text-rose-100/80">
                                {episodesQuery.error instanceof Error
                                  ? episodesQuery.error.message
                                  : 'An unexpected error happened while loading episodes.'}
                              </p>
                            </div>
                          </div>
                        ) : null}

                        {showEpisodeEmptyState ? (
                          <div className="px-6 py-6">
                            <Empty className="rounded-2xl border border-dashed border-white/10 bg-[#1c1d21] p-10">
                              <EmptyHeader>
                                <EmptyMedia variant="icon">
                                  <Video />
                                </EmptyMedia>
                                <EmptyTitle className="text-white">
                                  No episodes in this season yet
                                </EmptyTitle>
                                <EmptyDescription className="text-[#d5d0c5]">
                                  Add the first episode to start building this
                                  season timeline.
                                </EmptyDescription>
                              </EmptyHeader>
                              <EmptyContent>
                                <Button onClick={openCreateEpisodeModal}>
                                  <Plus className="size-4" />
                                  <span>Create episode</span>
                                </Button>
                              </EmptyContent>
                            </Empty>
                          </div>
                        ) : null}

                        {!episodesQuery.isLoading &&
                        !episodesQuery.isError &&
                        episodes.length > 0 ? (
                          <div className="space-y-4">
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-white/10">
                                <thead className="bg-[#2a2c31]">
                                  <tr className="text-left text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    <th
                                      scope="col"
                                      className="px-5 py-4 font-medium"
                                    >
                                      Episode
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-5 py-4 font-medium"
                                    >
                                      Description
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-5 py-4 font-medium"
                                    >
                                      Release date
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-5 py-4 font-medium"
                                    >
                                      Rating
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-5 py-4 font-medium"
                                    >
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                  {episodes.map((episode) => (
                                    <tr
                                      key={episode.key}
                                      aria-label={`Open details for episode ${episode.episodeNumber} ${episode.title}`}
                                      tabIndex={0}
                                      onClick={() =>
                                        setEpisodeInDetails(episode)
                                      }
                                      onKeyDown={(event) => {
                                        if (
                                          event.key === 'Enter' ||
                                          event.key === ' '
                                        ) {
                                          event.preventDefault();
                                          setEpisodeInDetails(episode);
                                        }
                                      }}
                                      className="cursor-pointer align-top transition hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-none"
                                    >
                                      <td className="px-5 py-4">
                                        <div className="space-y-2">
                                          <p className="font-medium text-white">
                                            Episode {episode.episodeNumber}
                                          </p>
                                          <div
                                            className="max-w-35 truncate text-sm text-[#d5d0c5]"
                                            title={episode.title}
                                          >
                                            {episode.title}
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-5 py-4">
                                        <div
                                          className="max-w-40 truncate text-sm leading-6 text-muted-foreground"
                                          title={episode.description}
                                        >
                                          {episode.description}
                                        </div>
                                      </td>
                                      <td className="px-5 py-4 text-sm text-[#d5d0c5]">
                                        {formatDate(episode.releaseDate)}
                                      </td>
                                      <td className="px-5 py-4 text-sm text-[#d5d0c5]">
                                        {episode.rating ?? '—'}
                                      </td>
                                      <td className="min-w-45 px-5 py-4 whitespace-nowrap">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(event) => {
                                              event.stopPropagation();
                                              openEditEpisodeModal(episode);
                                            }}
                                          >
                                            Edit
                                          </Button>
                                          <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={(event) => {
                                              event.stopPropagation();
                                              setEpisodePendingDeletion(
                                                episode,
                                              );
                                            }}
                                          >
                                            Delete
                                          </Button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-center sm:justify-between">
                              <p className="text-sm text-muted-foreground">
                                Page {safeCurrentEpisodePage} of{' '}
                                {totalEpisodePages}.
                              </p>
                              <Pagination className="mx-0 w-auto justify-start sm:justify-end">
                                <PaginationContent>
                                  <PaginationItem>
                                    <PaginationPrevious
                                      href="#season-episodes-pagination"
                                      aria-disabled={!hasPreviousEpisodePage}
                                      className={
                                        !hasPreviousEpisodePage
                                          ? 'pointer-events-none opacity-50'
                                          : undefined
                                      }
                                      onClick={(event) => {
                                        event.preventDefault();
                                        handlePreviousEpisodePage();
                                      }}
                                    />
                                  </PaginationItem>
                                  <PaginationItem>
                                    <PaginationNext
                                      href="#season-episodes-pagination"
                                      aria-disabled={!hasNextEpisodePage}
                                      className={
                                        !hasNextEpisodePage
                                          ? 'pointer-events-none opacity-50'
                                          : undefined
                                      }
                                      onClick={(event) => {
                                        event.preventDefault();
                                        handleNextEpisodePage();
                                      }}
                                    />
                                  </PaginationItem>
                                </PaginationContent>
                              </Pagination>
                            </div>
                          </div>
                        ) : null}
                      </CardContent>
                    </Card>
                  ) : null}
                </div>
              </div>
            </>
          ) : null}
        </section>
      </PageShell>

      {tvShow && seasonFormMode ? (
        <SeasonFormModal
          mode={seasonFormMode}
          season={seasonInFocus}
          tvShow={tvShow}
          isPending={isSeasonFormPending}
          onClose={closeSeasonFormModal}
          onSubmit={handleSeasonSubmit}
        />
      ) : null}

      {tvShow && selectedSeason && seasonPendingDeletion ? (
        <SeasonDeleteDialog
          season={seasonPendingDeletion}
          tvShowTitle={tvShow.title}
          episodeCount={seasonEpisodesCount}
          isPending={deleteSeasonMutation.isPending}
          onClose={() => setSeasonPendingDeletion(null)}
          onConfirm={handleSeasonDelete}
        />
      ) : null}

      {tvShow && seasonInDetails ? (
        <SeasonDetailsModal
          season={seasonInDetails}
          tvShowTitle={tvShow.title}
          onClose={() => setSeasonInDetails(null)}
        />
      ) : null}

      {tvShow && selectedSeason && episodeFormMode ? (
        <EpisodeFormModal
          mode={episodeFormMode}
          episode={episodeInFocus}
          season={selectedSeason}
          tvShow={tvShow}
          isPending={isEpisodeFormPending}
          onClose={closeEpisodeFormModal}
          onSubmit={handleEpisodeSubmit}
        />
      ) : null}

      {tvShow && selectedSeason && episodePendingDeletion ? (
        <EpisodeDeleteDialog
          episode={episodePendingDeletion}
          seasonNumber={selectedSeason.number}
          tvShowTitle={tvShow.title}
          isPending={deleteEpisodeMutation.isPending}
          onClose={() => setEpisodePendingDeletion(null)}
          onConfirm={handleEpisodeDelete}
        />
      ) : null}

      {tvShow && selectedSeason && episodeInDetails ? (
        <EpisodeDetailsModal
          episode={episodeInDetails}
          seasonNumber={selectedSeason.number}
          tvShowTitle={tvShow.title}
          onClose={() => setEpisodeInDetails(null)}
        />
      ) : null}
    </>
  );
}
