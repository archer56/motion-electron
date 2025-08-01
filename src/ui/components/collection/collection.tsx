import type { FC } from 'react';
import React from 'react';
import { AssetCard } from './asset-card';

import type { BaseCollectionProps } from './types';
import type { AssetType, Movie, Season, Series } from '../../../shared/motion';
import { Link } from 'react-router-dom';
import { PosterImage } from '../poster-image/poster-image';
import { HiOutlineArrowSmallRight } from 'react-icons/hi2';

type CollectionProps = BaseCollectionProps & {
  assetType: AssetType;
  assets: Movie[] | Series[] | Season[];
  showAllCardUrl?: string;
};

export const Collection: FC<CollectionProps> = (props) => {
  const isMovie = (asset: Movie | Series | Season): asset is Movie => props.assetType === 'movies';
  const isSeries = (asset: Movie | Series | Season): asset is Series => props.assetType === 'series';
  const isSeason = (asset: Movie | Series | Season): asset is Season => 'seasonNumber' in asset;

  if (!props.assets.length) {
    return null;
  }

  const assets = props.assets.map((asset) => {
    if (isMovie(asset)) {
      return <AssetCard key={asset.id} asset={asset} type={'movies'} />;
    }

    if (isSeason(asset)) {
      return <AssetCard key={asset.id} asset={asset} type={'season'} includeTitle />;
    }

    if (isSeries(asset)) {
      return <AssetCard key={asset.id} asset={asset} type={'series'} />;
    }
  });

  return (
    <div className="collection">
      {props.title && <h2 className="collection__title">{props.title}</h2>}
      <ul className="collection__assets">
        {assets}
        {props.showAllCardUrl && (
          <Link to={props.showAllCardUrl}>
            <PosterImage icon={<HiOutlineArrowSmallRight />} direction="portrait" />
          </Link>
        )}
      </ul>
    </div>
  );
};
