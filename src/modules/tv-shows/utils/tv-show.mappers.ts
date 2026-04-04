import type {
  RawTvShow,
  TvShowViewModel,
} from '@/modules/tv-shows/types/tv-show.types';

export function mapRawTvShowToViewModel(
  rawTvShow: RawTvShow,
  coverImageUrl?: string,
): TvShowViewModel {
  return {
    key: rawTvShow['@key'],
    title: rawTvShow.title,
    description: rawTvShow.description,
    recommendedAge: rawTvShow.recommendedAge,
    updatedAt: rawTvShow['@lastUpdated'],
    lastTransaction: rawTvShow['@lastTx'],
    lastTransactionId: rawTvShow['@lastTxID'],
    coverImageUrl,
  };
}

export function mapRawTvShowsToViewModels(
  rawTvShows: RawTvShow[],
  coverImageUrls?: Record<string, string>,
): TvShowViewModel[] {
  return rawTvShows.map((tvShow) =>
    mapRawTvShowToViewModel(tvShow, coverImageUrls?.[tvShow.title]),
  );
}
