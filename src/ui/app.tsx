import React from 'react';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { routes, RouteUrls } from './routes';
import { Layout } from './components/layout/layout';
import { VideoPage } from './pages/video/video';

export const App = () => {
  const router = createHashRouter([
    {
      path: '/',
      element: <Layout />,
      children: routes,
    },
    {
      path: RouteUrls.VideoPage,
      element: <VideoPage />,
    },
  ]);

  return <RouterProvider router={router} />;
};
