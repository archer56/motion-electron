import { contextBridge, ipcRenderer } from 'electron';

export const lastKnownRoute = () => {
  const dataArgs = process.argv;

  const lastKnownRoute = dataArgs.find((arg) => arg.includes('--last-known-route='));
  const route = lastKnownRoute ? lastKnownRoute.replace('--last-known-route=', '') : null;

  contextBridge.exposeInMainWorld('lastKnownRoute', {
    route,
    setRoute: () => {
      return new Promise((resolve) => {
        ipcRenderer.send(`last-known-route-set`);
        ipcRenderer.once(`last-known-route-set-reply`, (_, args) => {
          resolve(args);
        });
      });
    },
  });
};
