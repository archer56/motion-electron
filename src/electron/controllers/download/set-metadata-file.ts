import Path from 'path';
import type { DownloadedAssetMetadata, DownloadMetadata } from './types';
import fs from 'fs/promises';
import { getAssetDownloadPath } from './get-asset-download-path';
import type { AssetType } from '../../../shared/motion';

type SetMetadataFile = {
  id: number;
  assetType: AssetType;
  metadata: DownloadMetadata;
  videoFileType: string;
  downloadComplete: boolean;
  posterSrc?: string;
  seriesPosterSrc?: string;
};
export const setMetadataFile = async (options: SetMetadataFile) => {
  const dataToSave: DownloadedAssetMetadata = {
    id: options.metadata.asset.id,
    title: options.metadata.asset.title ?? '',
    description: options.metadata.asset.description ?? '',
    posterSrc: options?.posterSrc ?? options.metadata.asset.posterSrc ?? '',
    seriesPosterSrc: options?.seriesPosterSrc ?? '',
    length: options.metadata.metadata.length,
    videoFileType: options.videoFileType,
    downloadComplete: options.downloadComplete,
  };

  if (options.assetType === 'series') {
    if ('seriesId' in options.metadata.asset) {
      dataToSave.seriesId = options.metadata.asset.seriesId;
      dataToSave.seasonId = options.metadata.asset.seasonId;
      dataToSave.episodeNumber = options.metadata.asset?.episodeNumber;
      dataToSave.seasonNumber = options.metadata.season?.seasonNumber;
      dataToSave.seriesTitle = options.metadata.series?.title;
      dataToSave.seasonTitle = options.metadata.season?.title;
    }
  }

  const folderPath = getAssetDownloadPath(options.id, options.assetType);

  await fs.mkdir(folderPath, { recursive: true });

  const filePath = Path.join(folderPath, 'metadata.json');

  const jsonData = JSON.stringify(dataToSave, null, 2);
  await fs.writeFile(filePath, jsonData, 'utf8');
};
