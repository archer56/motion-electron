export type AssetType = 'series' | 'movies';
export type SeriesType = 'episode' | 'season';

export type Id = number;

export type Cast = {
  id: Id;
  personId: number;
  character?: string;
  name?: string;
  profileSrc?: string;
};

export type Movie = {
  backdropSrc?: string;
  createdAt?: string;
  description?: string;
  directory?: string;
  genres?: string[];
  id: Id;
  imdb?: string;
  posterSrc?: string;
  rating?: number;
  releaseDate?: string;
  runtime?: number;
  title?: string;
  updatedAt?: string;
  videoSrc?: string;
  cast?: Cast[];
};

export type Series = {
  id: Id;
  title: string;
  numberOfEpisodes: number;
  numberOfSeasons: number;
  description: string;
  posterSrc: string;
  backdropSrc: string;
  rating: number;
  firstAirDate: string;
  lastAirDate: string;
  genres: string;
  directory?: string;
  seasons?: Season[];
};

export type Season = {
  id: Id;
  seriesId: Series['id'];
  numberOfEpisodes: number;
  title: string;
  posterSrc: string;
  backdropSrc: string;
  description: string;
  seasonNumber: number;
  airDate: string;
  episodes?: Episode[];
};

export type Episode = {
  id: Id;
  seriesId: Series['id'];
  seasonId: Season['id'];
  title: string;
  description: string;
  posterSrc: string;
  rating: number;
  runtime: number;
  episodeNumber: number;
  airDate: string;
  videoSrc: string;
  watchProgress?: number;
  watchProgressDate?: string;
  watched?: boolean;
};

export const allowedGenres = [
  'action',
  'adventure',
  'animation',
  'comedy',
  'crime',
  'documentary',
  'drama',
  'family',
  'fantasy',
  'history',
  'horror',
  'music',
  'mystery',
  'romance',
  'science fiction',
  'tv movie',
  'thriller',
  'war',
  'western',
] as const;

export type Metadata = {
  length: number;
  supportedOnWeb: boolean;
};
