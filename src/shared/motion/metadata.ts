import axios from 'axios';
import { config } from '../../electron/config';
import type { AssetType } from './types';

type UpdateMetadataOptions = {
  assetType: AssetType;
};
export const updateMetadata = async (options: UpdateMetadataOptions) => {
  return axios.post(`${config.motion}/metadata/${options.assetType}/update`);
};
