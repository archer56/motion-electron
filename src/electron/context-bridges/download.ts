import { contextBridge, ipcRenderer } from 'electron';

type AddDownload = (id: number) => Promise<void>;
type GetDownloadPercentage = (id: number) => Promise<number>;
type IsInQueue = (id: number) => Promise<boolean>;
type IsDownloaded = (id: number) => Promise<boolean>;

declare global {
  interface Window {
    download: {
      addDownload: AddDownload;
      getDownloadPercentage: GetDownloadPercentage;
      isInQueue: IsInQueue;
      isDownloaded: IsDownloaded;
    };
  }
}

export const download = () => {
  const addDownload: AddDownload = (id: number) => {
    return new Promise((resolve) => {
      ipcRenderer.send(`add-download`, id);
      ipcRenderer.once(`add-download-reply`, (_, args) => {
        resolve(args);
      });
    });
  };

  const getDownloadPercentage: GetDownloadPercentage = (id: number) => {
    return new Promise((resolve) => {
      ipcRenderer.send(`get-download-percentage`, id);
      ipcRenderer.once(`get-download-percentage-reply`, (_, args) => {
        resolve(args);
      });
    });
  };

  const isInQueue: IsInQueue = (id: number) => {
    return new Promise((resolve) => {
      ipcRenderer.send(`is-in-queue`, id);
      ipcRenderer.once(`is-in-queue-reply`, (_, args) => {
        resolve(args);
      });
    });
  };

  const isDownloaded: IsDownloaded = (id: number) => {
    return new Promise((resolve) => {
      ipcRenderer.send(`is-downloaded`, id);
      ipcRenderer.once(`is-downloaded-reply`, (_, args) => {
        resolve(args);
      });
    });
  };

  contextBridge.exposeInMainWorld('download', {
    addDownload,
    getDownloadPercentage,
    isInQueue,
    isDownloaded,
  });
};
