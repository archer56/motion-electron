import fs from 'fs';
import Path from 'path';

import { motion, type AssetType } from '../../../shared/motion';
import { getAssetDownloadPath } from './get-asset-download-path';

type DownloadVideoOptions = {
  id: number;
  assetType: AssetType;
  fileType: string;
  onProgress: (percent: number) => void;
};

export const downloadVideo = async (options: DownloadVideoOptions) => {
  const folderPath = getAssetDownloadPath(options.id, options.assetType);
  const filePath = Path.join(folderPath, `video.${options.fileType}`);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  const writer = fs.createWriteStream(filePath);

  const response = await motion.download({
    id: options.id,
    assetType: options.assetType,
  });

  const totalLength = response.headers['content-length'];
  let downloaded = 0;

  response.data.on('data', (chunk: string) => {
    downloaded += chunk.length;
    const percent = ((downloaded / totalLength) * 100).toFixed(2);
    options.onProgress?.(Number(percent));
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(filePath));
    writer.on('error', reject);
  });
};
