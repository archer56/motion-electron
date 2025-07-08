import { BrowserWindow } from 'electron';
import Path from 'path';
import Vlc from './vlc';
import { isWindows } from './is-windows';
import { sessionStorage } from './session-storage';

let mainWindow: BrowserWindow = null;

export type CreateWindow = (options?: { transparent?: boolean; openDevTools?: boolean }) => BrowserWindow;

export const createWindow: CreateWindow = (options) => {
  const { transparent = false } = options ?? {};

  mainWindow?.hide();

  const lastKnownRoute = sessionStorage.get('lastKnownRoute');

  const newWindow = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: transparent,
    frame: !transparent,
    simpleFullscreen: transparent,
    webPreferences: {
      preload: Path.join(__dirname, '../preload.js'),
      nodeIntegration: true,
      additionalArguments: [`--last-known-route=${lastKnownRoute}`],
    },
    icon: Path.join(__dirname, '../assets/icons/png/icon-256x256.png'),
  });

  newWindow.loadFile('index.html');
  newWindow.setMenu(null);

  if (options?.openDevTools) {
    newWindow.webContents.openDevTools({ mode: 'bottom' });
  }

  if (isWindows()) {
    newWindow.on('focus', () => {
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
