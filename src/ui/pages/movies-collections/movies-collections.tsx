import type { FC } from 'react';
import React from 'react';
import { CollectionContinueWatching, CollectionGenre, CollectionRecentlyAdded } from '../../components/collection';

export const MoviesCollectionsPage: FC = () => {
  return (
    <div className="movies-collections">
      <CollectionContinueWatching title="Continue Watching" type="movies" />
      <CollectionRecentlyAdded title="Recently Added" type="movies" />
      <CollectionGenre title="Comedy" type="movies" genre="comedy" />
      <CollectionGenre title="Action" type="movies" genre="action" />
      <CollectionGenre title="Thrillers" type="movies" genre="thriller" />
      <CollectionGenre title="Animated" type="movies" genre="animation" />
    </div>
  );
};
