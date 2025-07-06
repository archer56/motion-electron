export type AssetType = 'series' | 'movies';

export type Cast = {
  id: number;
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
  id: number;
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
