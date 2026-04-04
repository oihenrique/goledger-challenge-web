import type {
  RawSeason,
  SeasonViewModel,
} from '@/modules/seasons/types/season.types';

export function mapRawSeasonToViewModel(rawSeason: RawSeason): SeasonViewModel {
  return {
    key: rawSeason['@key'],
    number: rawSeason.number,
    year: rawSeason.year,
    tvShowKey: rawSeason.tvShow['@key'],
    updatedAt: rawSeason['@lastUpdated'],
    lastTransaction: rawSeason['@lastTx'],
    lastTransactionId: rawSeason['@lastTxID'],
  };
}

export function mapRawSeasonsToViewModels(
  rawSeasons: RawSeason[],
): SeasonViewModel[] {
  return rawSeasons.map(mapRawSeasonToViewModel);
}
