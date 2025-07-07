import type { FC } from 'react';
import React from 'react';
import { CollectionContinueWatching, CollectionGenre, CollectionRecentlyAdded } from '../../components/collection';

export const SeriesCollectionsPage: FC = () => {
  return (
    <div className="series-collections">
      <CollectionContinueWatching title="Continue Watching" type="series" />
      <CollectionRecentlyAdded title="Recently Added" type="series" />
      <CollectionGenre title="Action" type="series" genre="action" />
      <CollectionGenre title="Comedy" type="series" genre="comedy" />
    </div>
  );
};
