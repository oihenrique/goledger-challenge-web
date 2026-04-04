import type {
  EpisodeRelationViewModel,
  EpisodeViewModel,
} from '@/modules/episodes/types/episode.types';
import type {
  SeasonRelationViewModel,
  SeasonViewModel,
} from '@/modules/seasons/types/season.types';
import type { TvShowViewModel } from '@/modules/tv-shows/types/tv-show.types';

type TvShowRelationContext = Pick<TvShowViewModel, 'key' | 'title'> | null;

export function getOrderedTvShowSeasons(
  seasons: SeasonViewModel[],
  tvShow: TvShowRelationContext,
): SeasonRelationViewModel[] {
  if (!tvShow) {
    return [];
  }

  return seasons
    .filter((season) => season.tvShowKey === tvShow.key)
    .sort((left, right) => left.number - right.number)
    .map((season) => ({
      ...season,
      tvShowTitle: tvShow.title,
    }));
}

export function resolveActiveSeason(
  seasons: SeasonRelationViewModel[],
  selectedSeasonKey: string | null,
): SeasonRelationViewModel | null {
  if (seasons.length === 0) {
    return null;
  }

  if (selectedSeasonKey) {
    const matchedSeason =
      seasons.find((season) => season.key === selectedSeasonKey) ?? null;

    if (matchedSeason) {
      return matchedSeason;
    }
  }

  return seasons[0] ?? null;
}

export function mapEpisodesToRelationViewModels(
  episodes: EpisodeViewModel[],
  season: SeasonRelationViewModel | null,
  tvShow: TvShowRelationContext,
): EpisodeRelationViewModel[] {
  if (!season) {
    return [];
  }

  return [...episodes]
    .sort((left, right) => left.episodeNumber - right.episodeNumber)
    .map((episode) => ({
      ...episode,
      seasonNumber: season.number,
      seasonYear: season.year,
      tvShowKey: tvShow?.key,
      tvShowTitle: tvShow?.title,
    }));
}
