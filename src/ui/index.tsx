import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import { ElectronWindow } from '../../types/context-bridges/electron-window';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

declare global {
  interface Window {
    electronWindow: ElectronWindow;
  }
}

root.render(<App />);
