import { ipcMain } from 'electron';
import { DownloadManager } from './download-manager';

const downloader = new DownloadManager();

export const download = () => {
  ipcMain.on('add-download', async (event, id: number) => {
    downloader.addToQueue(id, 'movies');

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

  ipcMain.on('is-downloaded', async (event, id: number) => {
    const isDownloaded = await downloader.isDownloaded(id);

    event.sender.send('is-downloaded-reply', isDownloaded);
  });
};
