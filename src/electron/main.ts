import { app, BrowserWindow, globalShortcut } from 'electron';
import * as controllers from './controllers';
import { createWindow } from './utils/create-window';
import Vlc from './utils/vlc';
import { isWindows } from './utils/is-windows';
import { isDev } from './utils/is-dev';

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
  const window = createWindow({
    transparent: false,
    openDevTools: false,
  });

  controllers.vlc(window, createWindow);
  controllers.lastKnownRoute();
  controllers.routeHistory();

  if (isWindows()) {
    Vlc.initialise();
  }

  if (isWindows() && isDev()) {
    globalShortcut.register('CommandOrControl+R', () => {
      const mainWindow = BrowserWindow.getAllWindows()?.[0];
      if (mainWindow) {
        mainWindow.reload();
      }
    });
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
