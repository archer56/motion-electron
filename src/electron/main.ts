import { app, BrowserWindow } from 'electron';
import Path from 'path';

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,

    webPreferences: {
      preload: Path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      // contextIsolation: false,
    }
  })

  mainWindow.loadFile('index.html')

  mainWindow.webContents.openDevTools();
  mainWindow.setFullScreen(true);
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('ready', () => {
  createWindow()
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// console.log('fart')