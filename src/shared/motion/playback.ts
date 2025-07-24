import axios from 'axios';
import type { HttpsEndpoint } from '../../electron/config';
import { config } from '../../electron/config';
import type { AssetType, Id } from './types';

type GetPlaybackUrlOptions = {
  id: Id;
  assetType: AssetType;
};

export const getPlaybackUrl = (options: GetPlaybackUrlOptions): HttpsEndpoint => {
  return `${config.motion}/playback/${options.assetType}/${options.id}`;
};

type SetPlaybackPositionOptions = {
  /**
   * A number between 0 and 1 (inclusive) representing the playback position.
   */
  percentage: number;
  /**
   * A number showing the time in ms.
   */
  current: number;
  assetType: AssetType;
  id: Id;
};

export const setPlaybackPosition = async (options: SetPlaybackPositionOptions) => {
  const watched = options.percentage > 0.95 ? 'true' : 'false';
  const assetType = (options.assetType as AssetType) === 'movies' ? 'movies' : 'episodes';
  const progress = Math.floor(options.current);

  const url = `https://motion.archers.world/${assetType}/metadata/${options.id}?watched=${watched}&progress=${progress}`;

  return axios.put(url);
};
