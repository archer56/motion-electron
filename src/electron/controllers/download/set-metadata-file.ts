import Path from 'path';
import type { DownloadedAssetMetadata, DownloadMetadata } from './types';
import fs from 'fs/promises';
import { getAssetDownloadPath } from './get-asset-download-path';
import type { AssetType } from '../../../shared/motion';

export const setMetadataFile = async (
  id: number,
  assetType: AssetType,
  metadata: DownloadMetadata,
  videoFileType: string,
  downloadComplete: boolean,
) => {
  const dataToSave: DownloadedAssetMetadata = {
    id: metadata.asset.id,
    title: metadata.asset.title ?? '',
    description: metadata.asset.description ?? '',
    posterSrc: metadata.asset.posterSrc ?? '',
    length: metadata.metadata.length,
    videoFileType,
    downloadComplete,
  };

  if (assetType === 'series') {
    if ('seriesId' in metadata.asset) {
      dataToSave.seriesId = metadata.asset.seriesId;
      dataToSave.seasonId = metadata.asset.seasonId;
      dataToSave.episodeNumber = metadata.asset?.episodeNumber;
      dataToSave.seasonNumber = metadata.season?.seasonNumber;
      dataToSave.seriesTitle = metadata.series?.title;
      dataToSave.seasonTitle = metadata.season?.title;
    }
  }

  const folderPath = getAssetDownloadPath(id, assetType);

  await fs.mkdir(folderPath, { recursive: true });

  const filePath = Path.join(folderPath, 'metadata.json');

  const jsonData = JSON.stringify(dataToSave, null, 2);
  await fs.writeFile(filePath, jsonData, 'utf8');
};
