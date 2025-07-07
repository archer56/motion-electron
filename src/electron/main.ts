import { app, BrowserWindow } from 'electron';
import * as controllers from './controllers';
import { createWindow } from './utils/create-window';
import Vlc from './utils/vlc';
import { isWindows } from './utils/is-windows';

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
  const window = createWindow({
    transparent: false,
    openDevTools: true,
  });

  controllers.vlc(window, createWindow);
  controllers.lastKnownRoute();
  controllers.routeHistory();

  if (isWindows()) {
    Vlc.initialise();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
