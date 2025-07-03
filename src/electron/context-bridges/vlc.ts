import { contextBridge, ipcRenderer } from 'electron';

const createConnection = (key: string) => {
  return () => {
    return new Promise((resolve) => {
      ipcRenderer.send(`vlc-${key}`);
      ipcRenderer.once(`vlc-${key}-reply`, () => {
        resolve(true);
      });
    });
  };
};

export const vlc = () => {
  contextBridge.exposeInMainWorld('vlc', {
    open: createConnection('open'),
    close: createConnection('close'),
    play: createConnection('play'),
    pause: createConnection('pause'),
  });
};
