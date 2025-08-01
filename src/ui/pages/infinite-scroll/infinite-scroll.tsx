import type { FC } from 'react';
import React, { useState } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import {
  useFetchAssetsByContinueWatching,
  useFetchAssetsByGenre,
  useFetchAssetsByRecentlyAdded,
} from '../../hooks/use-fetch-motion';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';
import { AssetCard } from '../../components/collection/asset-card';
import type { allowedGenres, AssetType, Movie, Series } from '../../../shared/motion';
import { useParams } from 'react-router-dom';
import type { FetchReturn } from '../../hooks/use-fetch';

type UseFetchInfiniteScrollOptions = {
  collection: string;
  assetType: AssetType;
  limit: number;
};

const useFetchInfiniteScroll = (
  options: UseFetchInfiniteScrollOptions,
): FetchReturn<{
  assets: Movie[] | Series[];
  totalAssets: number;
}> => {
  if (options.collection === 'recently-added') {
    return useFetchAssetsByRecentlyAdded({
      assetType: options.assetType,
      limit: options.limit,
    });
  }

  if (options.collection === 'continue-watching') {
    return useFetchAssetsByContinueWatching({
      assetType: options.assetType,
      limit: options.limit,
    });
  }

  return useFetchAssetsByGenre({
    assetType: options.assetType,
    genre: options.collection as (typeof allowedGenres)[number],
    limit: options.limit,
  });
};

export const InfiniteScroll: FC = () => {
  const [limit, setLimit] = useState<number>(30);
  const [reachedLimit, setReachedLimit] = useState<boolean>(false);
  const params = useParams();

  const assetType = params.assetType as AssetType;
  const collection = params?.collection as string;

  const { loading, data, error } = useFetchInfiniteScroll({
    assetType,
    collection,
    limit,
  });

  const onLoadMore = () => {
    const newLimit = limit + 30;
    setLimit(() => newLimit);

    if (newLimit >= (data?.totalAssets ?? 0)) {
      setReachedLimit(() => true);
    }
  };

  const [infiniteRef, { rootRef }] = useInfiniteScroll({
    loading,
    hasNextPage: !reachedLimit,
    onLoadMore,
    disabled: error,
    rootMargin: '0px 0px 400px 0px',
  });

  return (
    <div ref={rootRef} className="infinite-scroll">
      <ul className="infinite-scroll__list">
        {data?.assets?.map((asset) => {
          if (assetType === 'movies') {
            return <AssetCard asset={asset as Movie} type="movies" key={asset.id} />;
          }

          return <AssetCard asset={asset as Series} type="series" key={asset.id} />;
        })}
      </ul>
      {!reachedLimit && <div ref={infiniteRef}>{loading && <LoadingSpinner />}</div>}
    </div>
  );
};
