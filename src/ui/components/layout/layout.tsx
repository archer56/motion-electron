import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Nav } from './components/nav';
import { RouteSync } from './components/route-sync';

export const Layout: FC<PropsWithChildren> = () => {
  return (
    <main className="layout">
      <Nav />
      <Outlet />
      <RouteSync />
    </main>
  );
};
