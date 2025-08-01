import type { FC } from 'react';
import React from 'react';
import { AssetCard } from './asset-card';

import type { BaseCollectionProps } from './types';
import type { Movie, Season, Series } from '../../../shared/motion';
import { Link } from 'react-router-dom';
import { PosterImage } from '../poster-image/poster-image';
import { HiOutlineArrowSmallRight } from 'react-icons/hi2';

type CollectionProps = BaseCollectionProps & {
  type: 'movies' | 'series' | 'seasons';
  assets: Movie[] | Series[] | Season[];
  showAllCard?: boolean;
};

export const Collection: FC<CollectionProps> = (props) => {
  const isMovie = (asset: Movie | Series | Season): asset is Movie => props.type === 'movies';
  const isSeries = (asset: Movie | Series | Season): asset is Series => props.type === 'series';
  const isSeason = (asset: Movie | Series | Season): asset is Season => 'seasonNumber' in asset;

  if (!props.assets.length) {
    return null;
  }

  const assets = props.assets.map((asset) => {
    if (isMovie(asset)) {
      return <AssetCard key={asset.id} asset={asset} type={'movies'} />;
    }

    if (isSeries(asset)) {
      return <AssetCard key={asset.id} asset={asset} type={'series'} />;
    }

    if (isSeason(asset)) {
      return <AssetCard key={asset.id} asset={asset} type={'season'} includeTitle />;
    }
  });

  return (
    <div className="collection">
      {props.title && <h2 className="collection__title">{props.title}</h2>}
      <ul className="collection__assets">
        {assets}
        {props.showAllCard && (
          <Link to={'/movies/all/comedy'}>
            <PosterImage icon={<HiOutlineArrowSmallRight />} direction="portrait" />
          </Link>
        )}
      </ul>
    </div>
  );
};
