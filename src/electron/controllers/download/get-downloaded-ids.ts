import Path from 'path';
import fs from 'fs/promises';
import { getMotionDownloadFolder } from './get-motion-download-folder';

export const getDownloadedIds = async (): Promise<string[]> => {
  const folderPath = getMotionDownloadFolder();

  const entries = await fs.readdir(folderPath);

  const assetIds: string[] = [];

  for (const entry of entries) {
    const fullPath = Path.join(folderPath, entry);
    const entryStat = await fs.stat(fullPath);

    if (entryStat.isDirectory()) {
      assetIds.push(entry);
    }
  }

  return assetIds;
};
