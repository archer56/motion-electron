import { contextBridge, ipcRenderer } from 'electron';
import type { DownloadedAssets } from '../controllers/download/types';
import type { AssetType } from '../../shared/motion';

type AddDownload = (id: number, assetType: AssetType) => Promise<void>;
type GetDownloadPercentage = (id: number) => Promise<number>;
type IsInQueue = (id: number) => Promise<boolean>;
type IsDownloaded = (id: number, assetType: AssetType) => Promise<boolean>;
type GetDownloadedAssets = () => Promise<DownloadedAssets>;

declare global {
  interface Window {
    download: {
      addDownload: AddDownload;
      getDownloadPercentage: GetDownloadPercentage;
      isInQueue: IsInQueue;
      isDownloaded: IsDownloaded;
      getDownloadedAssets: GetDownloadedAssets;
    };
  }
}

export const download = () => {
  const addDownload: AddDownload = (id: number, assetType: AssetType) => {
    return new Promise((resolve) => {
      ipcRenderer.send(`add-download`, id, assetType);
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

  const isDownloaded: IsDownloaded = (id: number, assetType: AssetType) => {
    return new Promise((resolve) => {
      ipcRenderer.send(`is-downloaded`, id, assetType);
      ipcRenderer.once(`is-downloaded-reply`, (_, args) => {
        resolve(args);
      });
    });
  };

  const getDownloadedAssets: GetDownloadedAssets = () => {
    return new Promise((resolve) => {
      ipcRenderer.send(`get-downloaded-assets`);
      ipcRenderer.once(`get-downloaded-assets-reply`, (_, args) => {
        resolve(args);
      });
    });
  };

  contextBridge.exposeInMainWorld('download', {
    addDownload,
    getDownloadPercentage,
    isInQueue,
    isDownloaded,
    getDownloadedAssets,
  });
};
