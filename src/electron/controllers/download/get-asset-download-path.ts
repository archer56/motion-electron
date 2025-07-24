import Path from 'path';
import { getMotionDownloadFolder } from './get-motion-download-folder';

export const getAssetDownloadPath = (id: number) => Path.join(getMotionDownloadFolder(), `${id}`);
