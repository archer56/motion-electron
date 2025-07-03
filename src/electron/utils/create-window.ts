import { BrowserWindow } from 'electron';
import Path from 'path';

let mainWindow: BrowserWindow = null;

export type CreateWindow = (options?: { transparent?: boolean }) => BrowserWindow;

export const createWindow: CreateWindow = (options) => {
  const { transparent = false } = options ?? {};

  mainWindow?.hide();

  const newWindow = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: transparent,
    frame: !transparent,
    simpleFullscreen: transparent,
    webPreferences: {
      preload: Path.join(__dirname, '../preload.js'),
      nodeIntegration: true,
    },
  });

  newWindow.loadFile('index.html');
  newWindow.setMenu(null);
  newWindow.webContents.openDevTools();

  setTimeout(() => {
    // fix bug when opening vlc
    newWindow.focus();
  }, 100);

  mainWindow?.close();

  mainWindow = newWindow;

  return mainWindow;
};
