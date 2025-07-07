import { ipcMain } from 'electron';
import { sessionStorage } from '../utils/session-storage';

export const historyAdd = (newRoute: string) => {
  const history = sessionStorage.get('route-history') as string[];
  const latestExistingPage = history[history.length - 1];

  if (latestExistingPage === newRoute) {
    return;
  }

  sessionStorage.set('route-history', [...history, newRoute]);
};

export const historyPop = () => {
  const history = sessionStorage.get('route-history') as string[];
  sessionStorage.set('route-history', history.slice(0, -1));
};

export const routeHistory = () => {
  ipcMain.on('route-history-get', (event) => {
    const history = sessionStorage.get('route-history');

    event.sender.send('route-history-get-reply', history);
  });
  ipcMain.on('route-history-add', (event, newRoute) => {
    historyAdd(newRoute);

    event.sender.send('route-history-add-reply');
  });

  ipcMain.on('route-history-pop', (event) => {
    historyPop();
    event.sender.send('route-history-pop-reply');
  });

  ipcMain.on('route-history-clear', (event) => {
    sessionStorage.set('route-history', []);

    event.sender.send('route-history-clear-reply');
  });
};
