import type {
  EpisodeViewModel,
  RawEpisode,
} from '@/modules/episodes/types/episode.types';

export function mapRawEpisodeToViewModel(
  rawEpisode: RawEpisode,
): EpisodeViewModel {
  return {
    key: rawEpisode['@key'],
    episodeNumber: rawEpisode.episodeNumber,
    title: rawEpisode.title,
    description: rawEpisode.description,
    releaseDate: rawEpisode.releaseDate,
    rating: rawEpisode.rating,
    seasonKey: rawEpisode.season['@key'],
    updatedAt: rawEpisode['@lastUpdated'],
    lastTransaction: rawEpisode['@lastTx'],
  };
}

export function mapRawEpisodesToViewModels(
  rawEpisodes: RawEpisode[],
): EpisodeViewModel[] {
  return rawEpisodes.map(mapRawEpisodeToViewModel);
}
