import type { FC } from 'react';
import React from 'react';
import { Backdrop } from '../../components/backdrop/backdrop';
import { useParams } from 'react-router-dom';
import { useFetchAsset } from '../../hooks/use-fetch-motion';
import type { Series } from '../../../shared/motion';
import { Collection } from '../../components/collection/collection';

export const SeriesPage: FC = () => {
  const { id } = useParams();

  if (!id) {
    return <h1>Something went wrong</h1>;
  }

  const { loading, data, error } = useFetchAsset({
    assetType: 'series',
    id,
  });

  if (loading || error || !data?.asset) {
    return null;
  }

  const asset = data.asset as Series;

  return (
    <div className="series">
      <Backdrop
        key={asset.id}
        id={asset.id}
        title={asset.title ?? ''}
        src={asset.backdropSrc ?? ''}
        description={asset.description ?? ''}
        date={asset.firstAirDate ?? ''}
        assetType="series"
      />
      <div className="series__season-rail">
        <Collection assets={asset?.seasons ?? []} assetType="series" />
      </div>
    </div>
  );
};
