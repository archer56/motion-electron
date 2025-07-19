import Path from 'path';
import { app } from 'electron';

export const getDownloadPath = (id: number) => Path.join(app.getPath('downloads'), `motion/${id}`);
