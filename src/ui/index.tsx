import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import type { ElectronWindow } from '../../types/context-bridges/electron-window';
import './index.less';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

declare global {
  interface Window {
    electronWindow: ElectronWindow;
  }
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
