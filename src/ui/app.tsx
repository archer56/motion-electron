import React from 'react';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { routes } from './routes';
import { Layout } from './components/layout';

export const App = () => {
  const router = createHashRouter([
    {
      path: '/',
      element: <Layout />,
      children: routes,
    },
  ]);

  return <RouterProvider router={router} />;
};
