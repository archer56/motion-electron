import type { FC, PropsWithChildren } from 'react';
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Nav } from './components/nav';

export const Layout: FC<PropsWithChildren> = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const lastKnownRoute = window.lastKnownRoute.route;

    if (lastKnownRoute) {
      navigate(lastKnownRoute);
    }
  }, []);

  return (
    <main className="layout">
      <Nav />
      <Outlet />
    </main>
  );
};
