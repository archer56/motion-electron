import type { FC } from 'react';
import React from 'react';
import { Collection } from './collection';
import {
  useFetchAssetsByContinueWatching,
  useFetchAssetsByGenre,
  useFetchAssetsByRecentlyAdded,
} from '../../hooks/use-fetch-motion';
import type { BaseCollectionProps } from './types';
import type { allowedGenres } from '../../../server/routes/constants';

type CollectionGenre = BaseCollectionProps & {
  genre: (typeof allowedGenres)[number];
};

export const CollectionGenre: FC<CollectionGenre> = (props) => {
  const { loading, data, error } = useFetchAssetsByGenre({
    assetType: props.type,
    genre: props.genre,
    limit: 15,
  });

  if (error || loading || !data?.assets) {
    return null;
  }

  return <Collection title={props.title} type={props.type} assets={data.assets} />;
};

export const CollectionRecentlyAdded: FC<BaseCollectionProps> = (props) => {
  const { loading, data, error } = useFetchAssetsByRecentlyAdded({
    assetType: props.type,
    limit: 15,
  });

  if (error || loading || !data?.assets) {
    return null;
  }

  return <Collection title={props.title} type={props.type} assets={data.assets} />;
};

export const CollectionContinueWatching: FC<BaseCollectionProps> = (props) => {
  const { loading, data, error } = useFetchAssetsByContinueWatching({
    assetType: props.type,
    limit: 15,
  });

  if (error || loading || !data?.assets) {
    return null;
  }

  return <Collection title={props.title} type={props.type} assets={data.assets} />;
};
