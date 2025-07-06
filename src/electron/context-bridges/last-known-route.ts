import { contextBridge, ipcRenderer } from 'electron';

type SetRoute = (newRoute: string) => Promise<void>;
declare global {
  interface Window {
    lastKnownRoute: {
      route: string;
      setRoute: SetRoute;
    };
  }
}

export const lastKnownRoute = () => {
  const dataArgs = process.argv;

  const lastKnownRoute = dataArgs.find((arg) => arg.includes('--last-known-route='));
  const route = lastKnownRoute ? lastKnownRoute.replace('--last-known-route=', '') : null;

  const setRoute: SetRoute = (newRoute) => {
    return new Promise((resolve) => {
      ipcRenderer.send(`last-known-route-set`, newRoute);
      ipcRenderer.once(`last-known-route-set-reply`, (_, args) => {
        resolve(args);
      });
    });
  };

  contextBridge.exposeInMainWorld('lastKnownRoute', {
    route,
    setRoute,
  });
};
