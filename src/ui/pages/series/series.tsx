import type { FC } from 'react';
import React from 'react';
import { Backdrop } from '../../components/backdrop/backdrop';
import { useParams } from 'react-router-dom';
import { useFetchAsset } from '../../hooks/use-fetch-motion';
import { PlayVideoButton } from '../../components/play-video-button/play-video-button';
import type { Series } from '../../../types/motion';

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

  const seasons = asset.seasons?.map((season) => {
    const episodes = season.episodes?.map((episode) => {
      return (
        <li key={episode.id} style={{ marginBottom: '20px' }}>
          <PlayVideoButton key={episode.id} id={episode.id} text={episode.title} assetType="series" />
        </li>
      );
    });

    return (
      <ul key={season.id}>
        {season.title}
        {episodes}
      </ul>
    );
  });

  return (
    <div className="series">
      <Backdrop
        id={asset.id}
        title={asset.title ?? ''}
        src={asset.backdropSrc ?? ''}
        description={asset.description ?? ''}
        date={asset.firstAirDate ?? ''}
        assetType="series"
      />
      {seasons}
    </div>
  );
};
