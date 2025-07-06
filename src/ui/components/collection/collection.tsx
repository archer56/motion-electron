import type { FC } from 'react';
import React from 'react';
import { AssetCard } from './asset-card';

import type { BaseCollectionProps } from './types';
import type { Movie, Series } from '../../../types/motion';

type CollectionProps = BaseCollectionProps & {
  type: 'movies' | 'series';
  assets: Movie[] | Series[];
};

export const Collection: FC<CollectionProps> = (props) => {
  const isMovie = (asset: Movie | Series): asset is Movie => props.type === 'movies';

  if (!props.assets.length) {
    return null;
  }

  const assets = props.assets.map((asset) => {
    if (isMovie(asset)) {
      return <AssetCard key={asset.id} asset={asset} type={'movies'} />;
    } else {
      return <AssetCard key={asset.id} asset={asset} type={'series'} />;
    }
  });

  return (
    <div className="collection">
      <h2 className="collection__title">{props.title}</h2>
      <ul className="collection__assets">{assets}</ul>
    </div>
  );
};
