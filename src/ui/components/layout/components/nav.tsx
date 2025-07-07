import type { FC } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { RouteUrls } from '../../../routes';
import { BackButton } from '../../back-button/back-button';

export const Nav: FC = () => {
  return (
    <div className="nav">
      <nav className="nav__content">
        <BackButton />
        <Link to={RouteUrls.MoviesCollectionPage}>Movies</Link>
        <Link to={RouteUrls.SeriesCollectionPage}>Series</Link>
      </nav>
    </div>
  );
};
