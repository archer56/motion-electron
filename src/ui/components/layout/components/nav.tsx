import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useMatch } from 'react-router-dom';
import { RouteUrls } from '../../../routes';
import { BackButton } from '../../back-button/back-button';
import { SearchOverlay } from './search-overlay';
import { SearchBar } from './search-bar';
import { CollectionSearch } from '../../collection';
import classNames from 'classnames';

export const Nav: FC = () => {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleClose = () => {
    setIsSearchOpen(() => false);
    setSearchTerm(() => '');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Escape') {
      handleClose();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    handleClose();
  }, [location]);

  const isMoviePage = Boolean(useMatch(RouteUrls.MoviesPage));
  const isSeriesPage = Boolean(useMatch(RouteUrls.SeriesPage));
  const isSeasonPage = Boolean(useMatch(RouteUrls.SeasonPage));
  const isMovieCollectionPage = Boolean(useMatch(RouteUrls.MoviesCollectionPage));
  const isSeriesCollectionPage = Boolean(useMatch(RouteUrls.SeriesCollectionPage));
  const isSettingsPage = Boolean(useMatch(RouteUrls.SettingsPage));

  const showBackButton = isMoviePage || isSeriesPage || isSeasonPage;

  const handleSearchBarClick = () => {
    setIsSearchOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(() => newSearchTerm);
  };

  const moviesClassname = classNames('nav__collection-page', {
    'nav__collection-page--active': isMovieCollectionPage,
  });

  const seriesClassname = classNames('nav__collection-page', {
    'nav__collection-page--active': isSeriesCollectionPage,
  });

  const settingsClassname = classNames('nav__collection-page', {
    'nav__collection-page--active': isSettingsPage,
  });

  return (
    <div className="nav">
      <nav className="nav__content">
        <div className="nav__content-left">{showBackButton && <BackButton />}</div>
        <div className="nav__content-center">
          <Link to={RouteUrls.MoviesCollectionPage} className={moviesClassname}>
            Movies
          </Link>
          <Link to={RouteUrls.SeriesCollectionPage} className={seriesClassname}>
            Series
          </Link>
          <Link to={RouteUrls.SettingsPage} className={settingsClassname}>
            Settings
          </Link>
        </div>
        <div className="nav__content-right">
          <SearchBar isOpen={isSearchOpen} onOpenToggle={handleSearchBarClick} onChange={handleSearchChange} />
        </div>
      </nav>
      <SearchOverlay open={isSearchOpen}>
        {isSearchOpen && searchTerm.length > 2 ? (
          <>
            <CollectionSearch title="Movies" type="movies" searchTerm={searchTerm} />
            <CollectionSearch title="Series" type="series" searchTerm={searchTerm} />
          </>
        ) : (
          <p className="nav__start-searching">Start typing to search...</p>
        )}
      </SearchOverlay>
    </div>
  );
};
