import axios from 'axios';
import type { Episode, Season, AssetType } from '../../../shared/motion';
import { useEffect, useState } from 'react';

const hostname = 'https://motion.archers.world';

const movieTitle = 'Continue Watching';

type UseContinueWatchingOptions = {
  id: number;
  assetType: AssetType;
};

const padZero = (number: number): string => {
  return number < 10 ? '0' + number : String(number);
};

export const useContinueWatching = (options: UseContinueWatchingOptions) => {
  const [title, setTitle] = useState<string>(movieTitle);
  const [assetId, setAssetId] = useState<number>(options.id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getContinueWatching = async () => {
    if (options.assetType === 'movies') {
      setTitle(() => movieTitle);
      setAssetId(() => options.id);
      return;
    }

    setLoading(() => true);

    try {
      const nextEpisodeData = await axios.get<{ asset: Episode }>(`${hostname}/series/next-episode/${options.id}`);
      const { id: episodeId, seasonId, episodeNumber } = nextEpisodeData.data.asset;

      const seasonData = await axios.get<{ asset: Season }>(`${hostname}/series/find/season/${seasonId}`);

      const seasonNumber = padZero(seasonData.data.asset.seasonNumber);

      const title = `Play S${seasonNumber}E${padZero(episodeNumber)}`;
      setTitle(() => title);
      setAssetId(() => episodeId);
    } catch (e) {
      setError(() => 'Unable to get episode data');
    } finally {
      setLoading(() => false);
    }
  };

  useEffect(() => {
    getContinueWatching();
  }, [options.id, options.assetType]);

  return {
    title,
    assetId,
    loading,
    error,
  };
};
