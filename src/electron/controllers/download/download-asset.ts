import fs from 'fs';
import Path from 'path';
import axios from 'axios';
import { getDownloadPath } from './get-download-path';
import type { AssetType } from '../../../types/motion';

type DownloadVideoOptions = {
  id: number;
  assetType: AssetType;
  fileType: string;
  onProgress: (percent: number) => void;
};

export const downloadVideo = async (options: DownloadVideoOptions) => {
  const folderPath = getDownloadPath(options.id);
  const filePath = Path.join(folderPath, `video.${options.fileType}`);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  const writer = fs.createWriteStream(filePath);

  const response = await axios({
    url: `https://motion.archers.world/download/${options.assetType}/${options.id}`,
    method: 'GET',
    responseType: 'stream',
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
