import type { FC } from 'react';
import React from 'react';
import { CollectionContinueWatching, CollectionGenre, CollectionRecentlyAdded } from '../../components/collection';

export const MoviesCollectionsPage: FC = () => {
  return (
    <div className="movies-collections">
      <CollectionContinueWatching title="Continue Watching" assetType="movies" />
      <CollectionRecentlyAdded title="Recently Added" assetType="movies" showAllCard />
      <CollectionGenre title="Comedy" assetType="movies" genre="comedy" showAllCard />
      <CollectionGenre title="Action" assetType="movies" genre="action" showAllCard />
      <CollectionGenre title="Thrillers" assetType="movies" genre="thriller" showAllCard />
      <CollectionGenre title="Animated" assetType="movies" genre="animation" showAllCard />
    </div>
  );
};
