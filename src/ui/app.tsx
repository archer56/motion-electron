import React from 'react';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { offlineRoutes, routes, RouteUrls } from './routes';
import { Layout } from './components/layout/layout';
import { VideoPage } from './pages/video/video';
import { useOffline } from './context/offline-context';

export const App = () => {
  const { isOnline } = useOffline();
  const router = createHashRouter([
    {
      path: '/',
      element: <Layout />,
      children: isOnline ? routes : offlineRoutes,
    },
    {
      path: RouteUrls.VideoPage,
      element: <VideoPage />,
    },
  ]);

  return <RouterProvider router={router} />;
};
