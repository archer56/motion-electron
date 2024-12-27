export type ElectronWindow = {
  setFullscreen: () => Promise<boolean>
  unsetFullscreen: () => Promise<boolean>
};
