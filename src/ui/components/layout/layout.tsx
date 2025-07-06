import type { FC, PropsWithChildren } from 'react';
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export const Layout: FC<PropsWithChildren> = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const lastKnownRoute = window.lastKnownRoute.route;

    if (lastKnownRoute) {
      navigate(lastKnownRoute);
    }
  }, []);

  return (
    <div className="layout">
      <Outlet />
    </div>
  );
};
