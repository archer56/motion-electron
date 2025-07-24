import axios from 'axios';
import { config } from '../../electron/config';
import type { Episode, Id } from './types';

type GetNextEpisodeOptions = {
  id: Id;
};
export const getNextEpisode = async (options: GetNextEpisodeOptions) => {
  const response = await axios.get<{ asset: Episode }>(`${config.motion}/series/next-episode/${options.id}`);
  return response.data.asset;
};
