import { contextBridge, ipcRenderer } from 'electron';

const createConnection = <Params>(key: string) => {
  return (params: Params) => {
    return new Promise((resolve) => {
      ipcRenderer.send(`vlc-${key}`, params);
      ipcRenderer.once(`vlc-${key}-reply`, (_, args) => {
        resolve(args);
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
    seek: createConnection('seek'),
    timeState: createConnection<number>('timestate'),
  });
};
