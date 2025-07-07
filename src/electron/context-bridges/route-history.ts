import { contextBridge, ipcRenderer } from 'electron';

type GetRoutes = () => Promise<string[]>;
type AddRoute = (route: string) => Promise<void>;
type PopRoute = () => Promise<void>;
type ClearRoutes = () => Promise<void>;

declare global {
  interface Window {
    routeHistory: {
      getRoutes: GetRoutes;
      addRoute: AddRoute;
      popRoute: PopRoute;
      clearRoutes: ClearRoutes;
    };
  }
}

export const routeHistory = () => {
  const getRoutes: GetRoutes = () => {
    return new Promise((resolve) => {
      ipcRenderer.send(`route-history-get`);
      ipcRenderer.once(`route-history-get-reply`, (_, args) => {
        resolve(args);
      });
    });
  };

  const addRoute: AddRoute = (route) => {
    return new Promise((resolve) => {
      ipcRenderer.send(`route-history-add`, route);
      ipcRenderer.once(`route-history-add-reply`, (_, args) => {
        resolve(args);
      });
    });
  };

  const popRoute: PopRoute = () => {
    return new Promise((resolve) => {
      ipcRenderer.send(`route-history-pop`);
      ipcRenderer.once(`route-history-pop-reply`, (_, args) => {
        resolve(args);
      });
    });
  };

  const clearRoutes: ClearRoutes = () => {
    return new Promise((resolve) => {
      ipcRenderer.send(`route-history-clear`);
      ipcRenderer.once(`route-history-clear-reply`, (_, args) => {
        resolve(args);
      });
    });
  };

  contextBridge.exposeInMainWorld('routeHistory', {
    getRoutes,
    addRoute,
    popRoute,
    clearRoutes,
  });
};
