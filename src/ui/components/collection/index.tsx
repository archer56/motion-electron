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
import type { allowedGenres } from '../../../shared/motion';

type CollectionProps = BaseCollectionProps & {
  showAllCard?: boolean;
};

type CollectionGenreProps = CollectionProps & {
  genre: (typeof allowedGenres)[number];
  showAllCard?: boolean;
};

export const CollectionGenre: FC<CollectionGenreProps> = (props) => {
  const { loading, data, error } = useFetchAssetsByGenre({
    assetType: props.assetType,
    genre: props.genre,
    limit: 15,
  });

  if (error || loading || !data?.assets) {
    return null;
  }

  const showAllCardUrl = props.showAllCard ? `/infinite-scroll/${props.assetType}/${props.genre}` : '';

  return (
    <Collection title={props.title} assetType={props.assetType} assets={data.assets} showAllCardUrl={showAllCardUrl} />
  );
};

export const CollectionRecentlyAdded: FC<CollectionProps> = (props) => {
  const { loading, data, error } = useFetchAssetsByRecentlyAdded({
    assetType: props.assetType,
    limit: 15,
  });

  if (error || loading || !data?.assets) {
    return null;
  }

  const showAllCardUrl = props.showAllCard ? `/infinite-scroll/${props.assetType}/recently-added` : '';

  return (
    <Collection title={props.title} assetType={props.assetType} assets={data.assets} showAllCardUrl={showAllCardUrl} />
  );
};

export const CollectionContinueWatching: FC<CollectionProps> = (props) => {
  const { loading, data, error } = useFetchAssetsByContinueWatching({
    assetType: props.assetType,
    limit: 15,
  });

  if (error || loading || !data?.assets) {
    return null;
  }

  const showAllCardUrl = props.showAllCard ? `/infinite-scroll/${props.assetType}/continue-watching` : '';

  return (
    <Collection title={props.title} assetType={props.assetType} assets={data.assets} showAllCardUrl={showAllCardUrl} />
  );
};

type CollectionSearchProps = BaseCollectionProps & {
  searchTerm: string;
};

export const CollectionSearch: FC<CollectionSearchProps> = (props) => {
  const { loading, data, error } = useFetchAssets({
    assetType: props.assetType,
    limit: 5,
    search: props.searchTerm,
  });

  if (error || loading || !data?.assets) {
    return null;
  }

  return <Collection title={props.title} assetType={props.assetType} assets={data.assets} />;
};
