import Path from 'path';
import { app } from 'electron';

export const getMotionDownloadFolder = () => Path.join(app.getPath('downloads'), `motion`);
