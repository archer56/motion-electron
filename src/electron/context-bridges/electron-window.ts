import { contextBridge, ipcRenderer } from 'electron';

export const electronWindow = () => {
  contextBridge.exposeInMainWorld('electronWindow', {
    setFullscreen: () => {
      return new Promise((resolve) => {
        ipcRenderer.send('set-fullscreen');
        ipcRenderer.once('set-fullscreen-reply', () => {
          resolve(true);
        });
      });
    },
    unsetFullscreen: () => {
      return new Promise((resolve) => {
        ipcRenderer.send('unset-fullscreen');
        ipcRenderer.once('unset-fullscreen-reply', () => {
          resolve(true);
        });
      });
    },
  });
};
