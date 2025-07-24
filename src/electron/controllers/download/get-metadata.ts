import type { AssetType } from '../../../shared/motion';
import type { DownloadMetadata } from './types';
import { getMovie, getMovieMetadata, getSeries, getSeriesMetadata } from '../../../shared/motion/asset';

export const getMetadata = async (id: number, assetType: AssetType): Promise<DownloadMetadata | null> => {
  try {
    if (assetType === 'movies') {
      return {
        asset: await getMovie({ id }),
        metadata: {
          length: (await getMovieMetadata({ id })).length,
        },
      };
    }

    if (assetType === 'series') {
      return {
        asset: await getSeries({ id }),
        metadata: {
          length: (await getSeriesMetadata({ id })).length,
        },
      };
    }

    return null;
  } catch {
    return null;
  }
};
