import type { FC } from 'react';
import React from 'react';
import { useFetchAsset } from '../../hooks/use-fetch-motion';
import { useParams } from 'react-router-dom';
import { Backdrop } from '../../components/backdrop/backdrop';
import type { Movie } from '../../../types/motion';

export const MoviesPage: FC = () => {
  const { id } = useParams();

  if (!id) {
    return <h1>Something went wrong</h1>;
  }

  const { loading, data, error } = useFetchAsset({
    assetType: 'movies',
    id,
  });

  if (loading || error || !data?.asset) {
    return null;
  }

  const asset = data.asset as Movie;

  return (
    <div className="movie">
      <Backdrop
        key={asset.id}
        id={asset.id}
        title={asset.title ?? ''}
        src={asset.backdropSrc ?? ''}
        description={asset.description ?? ''}
        date={asset.releaseDate ?? ''}
        runtime={asset.runtime ?? 0}
        assetType="movies"
      />
    </div>
  );
};
