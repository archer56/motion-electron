import type { Episode, Movie, Season, Series } from '../../../shared/motion';

export type DownloadMetadata = {
  asset: Movie | Episode;
  season?: Season;
  series?: Series;
  metadata: {
    length: number;
  };
};

export type DownloadedAssetMetadata = {
  id: number;
  title: string;
  description: string;
  posterSrc: string;
  downloadComplete: boolean;
  length: number;
  videoFileType: string;
  seriesId?: number;
  seasonId?: number;
  episodeNumber?: number;
  seasonNumber?: number;
  seriesTitle?: string;
  seasonTitle?: string;
};

export type DownloadedAssets = {
  movies: DownloadedAssetMetadata[];
  series: DownloadedAssetMetadata[];
};
