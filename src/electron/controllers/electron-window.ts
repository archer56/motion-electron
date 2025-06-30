import type { BrowserWindow } from 'electron';
import { ipcMain } from 'electron';

export const electronWindow = (window: BrowserWindow) => {
  ipcMain.on('set-fullscreen', (event) => {
    window.setSimpleFullScreen(true);

    event.sender.send('set-fullscreen-reply');
  });

  ipcMain.on('unset-fullscreen', (event) => {
    window.setSimpleFullScreen(false);

    event.sender.send('unset-fullscreen-reply');
  });
};
