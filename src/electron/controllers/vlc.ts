import type { BrowserWindow } from 'electron';
import { ipcMain } from 'electron';
import vlcAddon from '../../../build/Release/vlc_addon.node';
import type { VlcAddon } from '../../../types/vlc-addon';
import type { CreateWindow } from '../utils/create-window';

const Vlc = vlcAddon as VlcAddon;

export const vlc = (window: BrowserWindow, createWindow: CreateWindow) => {
  ipcMain.on('vlc-open', (event) => {
    try {
      Vlc.open('http://192.168.1.56:3000/playback/movies/329');
    } catch (e) {
      console.error('unable to open vlc', e);
    }

    const win = createWindow({ transparent: true });
    win.setSimpleFullScreen(true);

    event.sender.send('vlc-open-reply');
  });

  ipcMain.on('vlc-close', (event) => {
    console.log('hiiiiiiiiiii controller');

    try {
      Vlc.close();
    } catch {}

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
    console.log('hiiiiii timestate');
    try {
      const timeState = await Vlc.getTimeState();
      event.sender.send('vlc-timestate-reply', timeState);
    } catch {
      event.sender.send('vlc-timestate-reply', {});
    }
  });
};
