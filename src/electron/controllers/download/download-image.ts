import fs from 'fs';
import axios from 'axios';
import Path from 'path';
import { getAssetDownloadPath } from './get-asset-download-path';
import type { AssetType } from '../../../shared/motion';

type DownloadImageOptions = {
  id: number;
  assetType: AssetType;
  url: string;
  name: string;
};

export const downloadImage = async (options: DownloadImageOptions): Promise<string> => {
  const fileType = Path.extname(options.url).replace('.', '');

  const folderPath = getAssetDownloadPath(options.id, options.assetType);
  const filePath = Path.join(folderPath, `${options.name}.${fileType}`);

  const writer = fs.createWriteStream(filePath);

  const res = await axios.get(options.url, {
    responseType: 'stream',
  });

  return new Promise((resolve, reject) => {
    res.data.pipe(writer);
    writer.on('finish', () => resolve(filePath));
    writer.on('error', reject);
  });
};
