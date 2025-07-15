import React from 'react';
import { MoviesCollectionsPage } from './pages/movies-collections/movies-collections';
import { Navigate } from 'react-router-dom';
import { MoviesPage } from './pages/movies/movies';
import { SeriesCollectionsPage } from './pages/series-collections/series-collections';
import { SeriesPage } from './pages/series/series';
import { SeasonPage } from './pages/season/season';
import { NotFoundPage } from './pages/not-found/not-found';
// import { SettingsPage } from './pages/settings/settings';
// import { DownloadsPage } from './pages/downloads/downloads';

export enum RouteUrls {
  RootPage = '/',
  MoviesCollectionPage = '/movies',
  MoviesPage = '/movies/:id',
  SeriesCollectionPage = '/series',
  SeriesPage = '/series/:id',
  SeasonPage = '/season/:id',
  VideoPage = '/:assetType/video/:id',
  // SettingsPage = '/settings',
  // DownloadsPage = '/downloads',
}

export const routes = [
  { index: true, element: <Navigate to={RouteUrls.MoviesCollectionPage} /> },
  { path: RouteUrls.MoviesCollectionPage, element: <MoviesCollectionsPage /> },
  { path: RouteUrls.MoviesPage, element: <MoviesPage /> },
  { path: RouteUrls.SeriesCollectionPage, element: <SeriesCollectionsPage /> },
  { path: RouteUrls.SeriesPage, element: <SeriesPage /> },
  { path: RouteUrls.SeasonPage, element: <SeasonPage /> },
  // { path: RouteUrls.SettingsPage, element: <SettingsPage /> },
  // { path: RouteUrls.DownloadsPage, element: <DownloadsPage /> },
  { path: '*', element: <NotFoundPage /> },
];
