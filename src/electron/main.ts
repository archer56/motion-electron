import { app, BrowserWindow } from 'electron';
import * as controllers from './controllers';
import Path from 'path';

let mainWindow: BrowserWindow = null;

const createWindow = (transparent = false) => {
  mainWindow?.hide();

  const newWindow = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: transparent,
    frame: !transparent,
    simpleFullscreen: transparent,
    webPreferences: {
      preload: Path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  newWindow.loadFile('index.html');
  newWindow.setMenu(null);
  // newWindow.webContents.openDevTools();
  setTimeout(() => {
    // fix bug when opening vlc
    newWindow.focus();
  }, 100);

  mainWindow?.close();

  mainWindow = newWindow;

  return mainWindow;
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
  const window = createWindow(false);

  controllers.electronWindow(window);
  controllers.vlc(window, createWindow);
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
