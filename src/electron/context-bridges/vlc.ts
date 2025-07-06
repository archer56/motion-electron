import { contextBridge, ipcRenderer } from 'electron';
import type { CloseOptions, OpenOptions, PlaybackState, TimeState } from '../../types/connections/vlc';

type ExposedVlc = {
  open: (params: OpenOptions) => Promise<void>;
  close: (params: CloseOptions) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  seek: (seekMs: number) => Promise<void>;
  timeState: () => Promise<TimeState>;
  playbackState: () => Promise<PlaybackState>;
};

declare global {
  interface Window {
    vlc: ExposedVlc;
  }
}

const createConnection = <Params = void, Return = void>(
  key: string,
): Params extends void ? () => Promise<Return> : (params: Params) => Promise<Return> => {
  return ((params?: Params) => {
    ipcRenderer.send(`vlc-${key}`, params);
    return new Promise<Return>((resolve) => {
      ipcRenderer.once(`vlc-${key}-reply`, (_, args) => {
        resolve(args);
      });
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
};

const exposedVlc: ExposedVlc = {
  open: createConnection('open'),
  close: createConnection('close'),
  play: createConnection('play'),
  pause: createConnection('pause'),
  seek: createConnection('seek'),
  timeState: createConnection('timestate'),
  playbackState: createConnection('playback-state'),
};

export const vlc = () => {
  contextBridge.exposeInMainWorld('vlc', exposedVlc);
};
