import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import type { ProxyServer } from '../types/context-bridges/proxy-server';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

declare global {
  interface Window {
    proxyServer: ProxyServer;
  }
}

root.render(<App />);
