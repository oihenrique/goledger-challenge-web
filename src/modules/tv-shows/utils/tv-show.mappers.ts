import type {
  RawTvShow,
  TvShowViewModel,
} from '@/modules/tv-shows/types/tv-show.types';

export function mapRawTvShowToViewModel(rawTvShow: RawTvShow): TvShowViewModel {
  return {
    key: rawTvShow['@key'],
    title: rawTvShow.title,
    description: rawTvShow.description,
    recommendedAge: rawTvShow.recommendedAge,
    updatedAt: rawTvShow['@lastUpdated'],
    lastTransaction: rawTvShow['@lastTx'],
    lastTransactionId: rawTvShow['@lastTxID'],
  };
}

export function mapRawTvShowsToViewModels(
  rawTvShows: RawTvShow[],
): TvShowViewModel[] {
  return rawTvShows.map(mapRawTvShowToViewModel);
}
