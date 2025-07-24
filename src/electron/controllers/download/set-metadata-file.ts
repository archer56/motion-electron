import Path from 'path';
import type { DownloadedAssetMetadata, DownloadMetadata } from './types';
import fs from 'fs/promises';
import { getAssetDownloadPath } from './get-asset-download-path';

export const setMetadataFile = async (id: number, metadata: DownloadMetadata, downloadComplete: boolean) => {
  const dataToSave: DownloadedAssetMetadata = {
    id: metadata.asset.id,
    title: metadata.asset.title ?? '',
    description: metadata.asset.description ?? '',
    posterSrc: metadata.asset.posterSrc ?? '',
    length: metadata.metadata.length,
    downloadComplete,
  };

  const folderPath = getAssetDownloadPath(id);

  await fs.mkdir(folderPath, { recursive: true });

  const filePath = Path.join(folderPath, 'metadata.json');

  const jsonData = JSON.stringify(dataToSave, null, 2);
  await fs.writeFile(filePath, jsonData, 'utf8');
};
