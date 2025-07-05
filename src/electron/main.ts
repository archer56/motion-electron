import { app, BrowserWindow } from 'electron';
import * as controllers from './controllers';
import { createWindow } from './utils/create-window';
import Vlc from './utils/vlc';

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
  const window = createWindow({
    transparent: false,
  });

  controllers.electronWindow(window);
  controllers.vlc(window, createWindow);

  Vlc.initialise();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
