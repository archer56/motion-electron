import React from 'react';
import { MoviesCollectionsPage } from './pages/movies-collections/movies-collections';
// import { Navigate } from 'react-router-dom';
// import { MoviesPage } from './pages/movies/movies';
import { SeriesCollectionsPage } from './pages/series-collections/series-collections';
// import { SeriesPage } from './pages/series/series';
// import { SettingsPage } from './pages/settings/settings';
import { VideoPage } from './pages/video/video';
// import { DownloadsPage } from './pages/downloads/downloads';

export enum RouteUrls {
  RootPage = '/',
  MoviesCollectionPage = '/movies',
  // MoviesPage = '/movies/:id',
  SeriesCollectionPage = '/series',
  // SeriesPage = '/series/:id',
  VideoPage = '/:assetType/video/:id',
  // SettingsPage = '/settings',
  // DownloadsPage = '/downloads',
}

export const routes = [
  { index: true, element: <MoviesCollectionsPage /> },
  { path: RouteUrls.MoviesCollectionPage, element: <MoviesCollectionsPage /> },
  // { path: RouteUrls.MoviesPage, element: <MoviesPage /> },
  { path: RouteUrls.SeriesCollectionPage, element: <SeriesCollectionsPage /> },
  // { path: RouteUrls.SeriesPage, element: <SeriesPage /> },
  { path: RouteUrls.VideoPage, element: <VideoPage /> },
  // { path: RouteUrls.SettingsPage, element: <SettingsPage /> },
  // { path: RouteUrls.DownloadsPage, element: <DownloadsPage /> },
  // { path: '*', element: <NotFoundPage /> },
  // { path: '*', element: <Navigate to={RouteUrls.RootPage} /> },
];
