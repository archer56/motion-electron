import { app, BrowserWindow } from 'electron';
import * as controllers from './controllers';
import { createWindow } from './utils/create-window';

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
  const window = createWindow({
    transparent: false,
  });

  controllers.electronWindow(window);
  controllers.vlc(window, createWindow);
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
