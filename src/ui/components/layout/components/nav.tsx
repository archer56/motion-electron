import type { FC } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { RouteUrls } from '../../../routes';

export const Nav: FC = () => {
  return (
    <div className="nav">
      <nav className="nav__content">
        <Link to={RouteUrls.MoviesCollectionPage}>Movies</Link>
        <Link to={RouteUrls.SeriesCollectionPage}>Series</Link>
      </nav>
    </div>
  );
};
