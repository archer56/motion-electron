import Path from 'path';
import type { DownloadedAssetMetadata } from './types';
import fs from 'fs/promises';
import { getAssetDownloadPath } from './get-asset-download-path';

export const getMetadataFile = async (id: number): Promise<DownloadedAssetMetadata> => {
  if (isNaN(id)) {
    return;
  }

  const folderPath = getAssetDownloadPath(id);
  const filePath = Path.join(folderPath, 'metadata.json');

  await fs.access(filePath);

  const file = await fs.readFile(filePath, 'utf8');

  return JSON.parse(file);
};
