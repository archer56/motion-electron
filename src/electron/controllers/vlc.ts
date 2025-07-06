import type { BrowserWindow } from 'electron';
import { ipcMain } from 'electron';
import Vlc from '../utils/vlc';
import type { CreateWindow } from '../utils/create-window';
import { sessionStorage } from '../utils/session-storage';
import type { CloseOptions, OpenOptions } from '../../types/connections/vlc';

export const vlc = (window: BrowserWindow, createWindow: CreateWindow) => {
  ipcMain.on('vlc-open', (event, options: OpenOptions) => {
    try {
      Vlc.open(`http://192.168.1.56:3000/playback/${options.assetType}/${options.id}`);

      sessionStorage.set('lastKnownRoute', `/${options.assetType}/video/${options.id}`);
      const win = createWindow({ transparent: true });
      win.setSimpleFullScreen(true);
    } catch (e) {
      console.error('unable to open vlc', e);
    }

    event.sender.send('vlc-open-reply');
  });

  ipcMain.on('vlc-close', (event, options: CloseOptions) => {
    try {
      Vlc.close();
    } catch {}

    sessionStorage.set('lastKnownRoute', `/${options.assetType}/${options.id}`);
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
};
