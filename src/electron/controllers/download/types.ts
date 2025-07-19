import type { Movie } from '../../../types/motion';

export type DownloadMetadata = {
  asset: Movie;
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
};
