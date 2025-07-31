import Path from 'path';
import { getMotionDownloadFolder } from './get-motion-download-folder';
import type { AssetType } from '../../../shared/motion';

export const getAssetDownloadPath = (id: number, assetType: AssetType) => {
  return Path.join(getMotionDownloadFolder(assetType), `${id}`);
};
