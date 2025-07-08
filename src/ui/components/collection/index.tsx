import type { FC } from 'react';
import React from 'react';
import { Collection } from './collection';
import {
  useFetchAssets,
  useFetchAssetsByContinueWatching,
  useFetchAssetsByGenre,
  useFetchAssetsByRecentlyAdded,
} from '../../hooks/use-fetch-motion';
import type { BaseCollectionProps } from './types';
import type { allowedGenres } from '../../../types/motion';

type CollectionGenreProps = BaseCollectionProps & {
  genre: (typeof allowedGenres)[number];
};

export const CollectionGenre: FC<CollectionGenreProps> = (props) => {
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

type CollectionSearchProps = BaseCollectionProps & {
  searchTerm: string;
};

export const CollectionSearch: FC<CollectionSearchProps> = (props) => {
  const { loading, data, error } = useFetchAssets({
    assetType: props.type,
    limit: 5,
    search: props.searchTerm,
  });

  if (error || loading || !data?.assets) {
    return null;
  }

  return <Collection title={props.title} type={props.type} assets={data.assets} />;
};
