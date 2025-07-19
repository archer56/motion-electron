import type { FC } from 'react';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetchAsset } from '../../hooks/use-fetch-motion';
import type { Season } from '../../../types/motion';
import { EpisodesRail } from './components/episodes-rail';

export const SeasonPage: FC = () => {
  const { id } = useParams();

  if (!id) {
    return <h1>Something went wrong</h1>;
  }

  const { loading, data, error } = useFetchAsset({
    assetType: 'series',
    seriesType: 'season',
    id,
  });

  if (loading || error || !data?.asset) {
    return null;
  }

  const asset = data.asset as Season;

  return (
    <div className="season">
      <p className="season__title">{asset.title}</p>
      <EpisodesRail episodes={asset.episodes ?? []} />
    </div>
  );
};
