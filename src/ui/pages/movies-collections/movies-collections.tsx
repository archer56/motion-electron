import type { FC } from 'react';
import React from 'react';
// import { useLocation } from 'react-router-dom';

export const MoviesCollectionsPage: FC = () => {
  // const location = useLocation();
  const handlePlayMovie = () => {
    window.vlc.open({
      assetType: 'movies',
      id: 87,
    });
  };

  return (
    <div>
      <h1>movies</h1>
      <button onClick={handlePlayMovie}>Play Movie!</button>
    </div>
  );
};
