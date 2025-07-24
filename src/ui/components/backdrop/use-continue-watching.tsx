import { type AssetType, motion } from '../../../shared/motion';
import { useEffect, useState } from 'react';

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
      const nextEpisodeData = await motion.getNextEpisode({ id: options.id });
      const { id: episodeId, seasonId, episodeNumber } = nextEpisodeData;

      const seasonData = await motion.getSeason({ id: seasonId });

      const seasonNumber = padZero(seasonData.seasonNumber);

      const title = `Play S${seasonNumber}E${padZero(episodeNumber)}`;
      setTitle(() => title);
      setAssetId(() => episodeId);
    } catch {
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
