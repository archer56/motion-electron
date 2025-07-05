import type { FC, PropsWithChildren } from 'react';
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export const Layout: FC<PropsWithChildren> = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    const lastKnownRoute = window.lastKnownRoute.route;
    if (lastKnownRoute) {
      navigate(lastKnownRoute);
    }
  }, []);

  console.log('layout render');

  return (
    <div>
      <Outlet />
    </div>
  );
};
