import type { Movie, Series } from '../../../shared/motion';

export type DownloadMetadata = {
  asset: Movie | Series;
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
