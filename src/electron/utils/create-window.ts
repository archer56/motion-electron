import { BrowserWindow } from 'electron';
import Path from 'path';
import Vlc from './vlc';
import { isWindows } from './is-windows';

let mainWindow: BrowserWindow = null;

export type CreateWindow = (options?: { transparent?: boolean; openDevTools?: boolean }) => BrowserWindow;

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
  if (options?.openDevTools) {
    newWindow.webContents.openDevTools();
  }

  if (isWindows()) {
    newWindow.on('focus', () => {
      console.log('UPDATE WINDOW POS');
      const hwndBuffer = newWindow.getNativeWindowHandle();
      const hwnd = hwndBuffer.readBigUInt64LE(0);

      Vlc.updateWindowPosition(hwnd);
    });
  }

  setTimeout(() => {
    // fix bug when opening vlc
    try {
      newWindow?.focus?.();
    } catch {}
  }, 100);

  mainWindow?.close();

  mainWindow = newWindow;

  return mainWindow;
};
