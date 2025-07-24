import axios from 'axios';
import type { AssetType, Id } from './types';
import { config } from '../../electron/config';

type DownloadOptions = {
  assetType: AssetType;
  id: Id;
};

export const download = (options: DownloadOptions) => {
  return axios({
    url: `${config.motion}/download/${options.assetType}/${options.id}`,
    method: 'GET',
    responseType: 'stream',
  });
};
