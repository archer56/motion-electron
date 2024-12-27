import { BrowserWindow, ipcMain } from 'electron';

export const electronWindow = (window: BrowserWindow) => {
  ipcMain.on('set-fullscreen', (event) => {
    window.setFullScreen(true);

    event.sender.send('set-fullscreen-reply');
  });

  ipcMain.on('unset-fullscreen', (event) => {
    window.setFullScreen(false);

    event.sender.send('unset-fullscreen-reply');
  });
}