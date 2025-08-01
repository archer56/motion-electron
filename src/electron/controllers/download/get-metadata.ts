import type { AssetType } from '../../../shared/motion';
import type { DownloadMetadata } from './types';
import { motion } from '../../../shared/motion';

export const getMetadata = async (id: number, assetType: AssetType): Promise<DownloadMetadata | null> => {
  try {
    if (assetType === 'movies') {
      return {
        asset: await motion.getMovie({ id }),
        metadata: {
          length: (await motion.getMovieMetadata({ id })).length,
        },
      };
    }

    if (assetType === 'series') {
      const episode = await motion.getEpisode({ id });
      const season = await motion.getSeason({ id: episode.seasonId });
      const series = await motion.getSeries({ id: episode.seriesId });

      return {
        asset: await motion.getEpisode({ id }),
        season,
        series,
        metadata: {
          length: 0,
        },
      };
    }

    return null;
  } catch (e) {
    console.log(`Unable to get metadata - ${e}`);
    return null;
  }
};
