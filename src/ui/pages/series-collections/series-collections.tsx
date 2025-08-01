import type { FC } from 'react';
import React from 'react';
import { CollectionContinueWatching, CollectionGenre, CollectionRecentlyAdded } from '../../components/collection';

export const SeriesCollectionsPage: FC = () => {
  return (
    <div className="series-collections">
      <CollectionContinueWatching title="Continue Watching" assetType="series" />
      <CollectionRecentlyAdded title="Recently Added" assetType="series" showAllCard />
      <CollectionGenre title="Action" assetType="series" genre="action" showAllCard />
      <CollectionGenre title="Comedy" assetType="series" genre="comedy" showAllCard />
    </div>
  );
};
