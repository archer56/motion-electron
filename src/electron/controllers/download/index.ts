import { ipcMain } from 'electron';
import { DownloadManager } from './download-manager';
import type { AssetType } from '../../../shared/motion';

const downloader = new DownloadManager();

export const download = () => {
  ipcMain.on('add-download', async (event, id: number, assetType: AssetType) => {
    downloader.addToQueue(id, assetType);

    event.sender.send('add-download-reply');
  });

  ipcMain.on('get-download-percentage', async (event, id: number) => {
    const percent = downloader.getProgress(id);

    event.sender.send('get-download-percentage-reply', percent);
  });

  ipcMain.on('is-in-queue', async (event, id: number) => {
    const isInQueue = downloader.isInQueue(id);

    event.sender.send('is-in-queue-reply', isInQueue);
  });

  ipcMain.on('is-downloaded', async (event, id: number, assetType: AssetType) => {
    const isDownloaded = await downloader.isDownloaded(id, assetType);

    event.sender.send('is-downloaded-reply', isDownloaded);
  });

  ipcMain.on('get-downloaded-assets', async (event) => {
    const downloadedAssets = await downloader.getDownloadedAssets();

    event.sender.send('get-downloaded-assets-reply', downloadedAssets);
  });
};
