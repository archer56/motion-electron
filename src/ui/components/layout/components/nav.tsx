import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useMatch } from 'react-router-dom';
import { RouteUrls } from '../../../routes';
import { BackButton } from '../../back-button/back-button';
import { SearchOverlay } from './search-overlay';
import { SearchBar } from './search-bar';
import { CollectionSearch } from '../../collection';

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

  const showBackButton = isMoviePage || isSeriesPage;

  const handleSearchBarClick = () => {
    setIsSearchOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(() => newSearchTerm);
  };

  return (
    <div className="nav">
      <nav className="nav__content">
        <div className="nav__content-left">{showBackButton && <BackButton />}</div>
        <div className="nav__content-center">
          <Link to={RouteUrls.MoviesCollectionPage} className="nav__collection-page">
            Movies
          </Link>
          <Link to={RouteUrls.SeriesCollectionPage} className="nav__collection-page">
            Series
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
