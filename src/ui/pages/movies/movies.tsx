import type { FC } from 'react';
import React from 'react';

export const MoviesPage: FC = () => {
  const handlePlayMovie = () => {
    window.vlc.open({
      assetType: 'movies',
      id: 87,
    });
  };

  return (
    <div>
      <h1>movie 87</h1>
      <button onClick={handlePlayMovie}>Play Movie!</button>
    </div>
  );
};
