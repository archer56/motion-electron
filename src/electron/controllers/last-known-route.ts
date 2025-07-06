import { ipcMain } from 'electron';
import { sessionStorage } from '../utils/session-storage';

export const lastKnownRoute = () => {
  ipcMain.on('last-known-route-set', (event, newRoute) => {
    if (newRoute) {
      sessionStorage.set('lastKnownRoute', newRoute);
    }

    event.sender.send('last-known-route-set-reply');
  });
};
