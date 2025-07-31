import Path from 'path';
import { app } from 'electron';
import type { AssetType } from '../../../shared/motion';

export const getMotionDownloadFolder = (assetType: AssetType) => {
  return Path.join(app.getPath('downloads'), `motion`, assetType);
};
