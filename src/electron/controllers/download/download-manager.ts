import type { AssetType } from '../../../shared/motion';
import { downloadVideo } from './download-asset';
import { getDownloadedIds } from './get-downloaded-ids';
import { getMetadata } from './get-metadata';
import { getMetadataFile } from './get-metadata-file';
import { setMetadataFile } from './set-metadata-file';
import Path from 'path';
import type { DownloadedAssets } from './types';
import { getAssetDownloadPath } from './get-asset-download-path';

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
    if (this._isDownloading || !this._queue.length) {
      return;
    }

    this._isDownloading = true;

    const asset = this._queue[0];

    try {
      const metadata = await getMetadata(asset.id, asset.assetType);
      if (!metadata) {
        throw new Error('No metadata found');
      }

      const fileType = Path.extname(metadata.asset.videoSrc).replace('.', '');
      await setMetadataFile(asset.id, asset.assetType, metadata, fileType, false);

      await downloadVideo({
        id: asset.id,
        assetType: asset.assetType,
        fileType,
        onProgress: (percent) => {
          this._queue[0].progress = percent;
        },
      });

      await setMetadataFile(asset.id, asset.assetType, metadata, fileType, true);
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

  public async isDownloaded(id: number, assetType: AssetType): Promise<boolean> {
    try {
      const data = await getMetadataFile(id, assetType);

      return data.downloadComplete;
    } catch {
      return false;
    }
  }

  public async getPlaybackUrl(id: number, assetType: AssetType): Promise<string> {
    const isDownloaded = this.isDownloaded(id, assetType);

    if (!isDownloaded) {
      throw new Error('Asset is not downloaded');
    }

    const data = await getMetadataFile(id, assetType);

    const assetPath = getAssetDownloadPath(id, assetType);
    return Path.join(assetPath, `video.${data.videoFileType}`);
  }

  public async getDownloadedAssets(): Promise<DownloadedAssets> {
    const downloadedMovieAssetIds = await getDownloadedIds('movies');
    const downloadedSeriesAssetIds = await getDownloadedIds('series');

    const assetMetadata: DownloadedAssets = {
      movies: [],
      series: [],
    };

    for (const downloadedMovieAsset of downloadedMovieAssetIds) {
      const metadata = await getMetadataFile(Number(downloadedMovieAsset), 'movies');
      assetMetadata.movies.push(metadata);
    }

    for (const downloadedSeriesAsset of downloadedSeriesAssetIds) {
      const metadata = await getMetadataFile(Number(downloadedSeriesAsset), 'series');
      assetMetadata.series.push(metadata);
    }

    return assetMetadata;
  }
}
