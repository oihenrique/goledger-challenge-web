export interface TmdbTvResult {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

export interface TmdbSearchResponse {
  page: number;
  results: TmdbTvResult[];
  total_pages: number;
  total_results: number;
}

export interface TmdbImageConfig {
  secure_base_url: string;
  poster_sizes: string[];
  backdrop_sizes: string[];
}

export interface TmdbEpisodeImage {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface TmdbEpisodeImagesResponse {
  id: number;
  stills: TmdbEpisodeImage[];
}
