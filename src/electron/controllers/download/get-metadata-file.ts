import Path from 'path';
import type { DownloadedAssetMetadata } from './types';
import fs from 'fs/promises';
import { getDownloadPath } from './get-download-path';

export const getMetadataFile = async (id: number): Promise<DownloadedAssetMetadata> => {
  const folderPath = getDownloadPath(id);
  const filePath = Path.join(folderPath, 'metadata.json');

  await fs.access(filePath);

  const file = await fs.readFile(filePath, 'utf8');

  return JSON.parse(file);
};
