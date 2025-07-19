import type { AssetType } from '../../../types/motion';
import { downloadVideo } from './download-asset';
import { getMetadata } from './get-metadata';
import { getMetadataFile } from './get-metadata-file';
import { setMetadataFile } from './set-metadata-file';
import Path from 'path';

type QueueItem = {
  id: number;
  assetType: AssetType;
  progress: number;
};

export class DownloadManager {
  private _queue: QueueItem[] = [];
  private _isDownloading: boolean = false;

  private downloadComplete() {
    this._queue = this._queue.splice(1);
    this._isDownloading = false;
  }

  private async initiateDownload() {
    if (this._isDownloading && this._queue.length > 0) {
      return;
    }

    this._isDownloading = true;

    const asset = this._queue[0];

    try {
      const metadata = await getMetadata(asset.id, asset.assetType);
      if (!metadata) {
        throw new Error('No metadata found');
      }

      await setMetadataFile(asset.id, metadata, false);
      const fileType = Path.extname(metadata.asset.videoSrc).replace('.', '');

      await downloadVideo({
        id: asset.id,
        assetType: asset.assetType,
        fileType,
        onProgress: (percent) => {
          this._queue[0].progress = percent;
        },
      });

      await setMetadataFile(asset.id, metadata, true);
    } catch (e) {
      console.error('Something went wrong downloading', e);
    } finally {
      this.downloadComplete();
      this.initiateDownload();
    }
  }

  public addToQueue(id: number, assetType: AssetType) {
    const isInQueue = this._queue.find((queueItem) => queueItem.id === id);
    if (isInQueue) {
      return;
    }

    this._queue.push({
      id,
      assetType,
      progress: 0,
    });

    this.initiateDownload();
  }

  public getProgress(id: number): number {
    const asset = this._queue.find((queueItem) => queueItem.id === id);
    if (!asset) {
      return null;
    }

    return asset.progress;
  }

  public isInQueue(id: number): boolean {
    const asset = this._queue.find((queueItem) => queueItem.id === id);

    return Boolean(asset);
  }

  public async isDownloaded(id: number): Promise<boolean> {
    try {
      const data = await getMetadataFile(id);

      return data.downloadComplete;
    } catch {
      return false;
    }
  }
}
