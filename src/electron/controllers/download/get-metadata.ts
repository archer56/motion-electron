import axios from 'axios';
import type { AssetType, Movie } from '../../../shared/motion';
import type { DownloadMetadata } from './types';

export const getMetadata = async (id: number, assetType: AssetType): Promise<DownloadMetadata | null> => {
  try {
    const assetUrl = `https://motion.archers.world/${assetType}/find/${id}`;
    const assetResponse = await axios.get(assetUrl);

    const videoMetadataUrl = `https://motion.archers.world/${assetType}/metadata/${id}`;
    const videoMetadataResponse = await axios.get(videoMetadataUrl);

    if (assetResponse.status !== 200 || videoMetadataResponse.status !== 200) {
      return null;
    }

    if (assetType === 'movies') {
      return {
        asset: assetResponse.data.asset as Movie,
        metadata: {
          length: videoMetadataResponse?.data?.data?.length ?? 0,
        },
      };
    }

    return null;
  } catch {
    return null;
  }
};
