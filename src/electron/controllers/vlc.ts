import type { BrowserWindow } from 'electron';
import { ipcMain } from 'electron';
import Vlc from '../utils/vlc';
import type { CreateWindow } from '../utils/create-window';
import { sessionStorage } from '../utils/session-storage';
import type { OpenOptions, AudioSubtitleTrack } from '../../types/connections/vlc';
import { motion } from '../../shared/motion';
import { DownloadManager } from './download/download-manager';

const downloader = new DownloadManager();

export const vlc = (window: BrowserWindow, createWindow: CreateWindow) => {
  ipcMain.on('vlc-open', async (event, options: OpenOptions) => {
    try {
      const isDownloaded = await downloader.isDownloaded(options.id, options.assetType);

      const url = isDownloaded
        ? await downloader.getPlaybackUrl(options.id, options.assetType)
        : motion.getPlaybackUrl({ assetType: options.assetType, id: options.id });

      Vlc.open(url);

      sessionStorage.set('lastKnownRoute', `/${options.assetType}/video/${options.id}`);
      const win = createWindow({ transparent: true });
      win.setSimpleFullScreen(true);
    } catch (e) {
      console.error('unable to open vlc', e);
    }

    event.sender.send('vlc-open-reply');
  });

  ipcMain.on('vlc-close', (event) => {
    try {
      Vlc.close();
    } catch {}
    sessionStorage.set('lastKnownRoute', '');
    createWindow({ transparent: false });

    event.sender.send('vlc-close-reply');
  });

  ipcMain.on('vlc-play', (event) => {
    Vlc.play();

    event.sender.send('vlc-play-reply');
  });

  ipcMain.on('vlc-pause', (event) => {
    Vlc.pause();

    event.sender.send('vlc-pause-reply');
  });

  ipcMain.on('vlc-seek', (event, seekMs: number) => {
    Vlc.seekTo(seekMs);

    event.sender.send('vlc-seek-reply');
  });

  ipcMain.on('vlc-timestate', async (event) => {
    try {
      const timeState = await Vlc.getTimeState();
      event.sender.send('vlc-timestate-reply', timeState);
    } catch {
      event.sender.send('vlc-timestate-reply', {});
    }
  });

  ipcMain.on('vlc-playback-state', async (event) => {
    try {
      const playbackState = await Vlc.getPlaybackState();
      event.sender.send('vlc-playback-state-reply', playbackState);
    } catch {
      event.sender.send('vlc-playback-state-reply', {});
    }
  });

  ipcMain.on('vlc-get-subtitles', async (event) => {
    try {
      const subtitles = await Vlc.getSubtitleTracks();
      event.sender.send('vlc-get-subtitles-reply', subtitles);
    } catch {
      event.sender.send('vlc-get-subtitles-reply', {});
    }
  });

  ipcMain.on('vlc-set-subtitle', async (event, id: AudioSubtitleTrack['id']) => {
    try {
      await Vlc.setSubtitleTrack(id);
      event.sender.send('vlc-set-subtitle-reply');
    } catch {
      event.sender.send('vlc-set-subtitle-reply');
    }
  });

  ipcMain.on('vlc-get-audio', async (event) => {
    try {
      const audioTracks = await Vlc.getAudioTracks();
      event.sender.send('vlc-get-audio-reply', audioTracks);
    } catch {
      event.sender.send('vlc-get-audio-reply', {});
    }
  });

  ipcMain.on('vlc-set-audio', async (event, id: AudioSubtitleTrack['id']) => {
    try {
      await Vlc.setAudioTrack(id);
      event.sender.send('vlc-set-audio-reply');
    } catch {
      event.sender.send('vlc-set-audio-reply');
    }
  });
};
