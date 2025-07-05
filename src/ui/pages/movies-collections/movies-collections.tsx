import type { FC } from 'react';
import React from 'react';
import { VideoPlayerOverlay } from '../../components/video-player-overlay/video-player-overlay';
// import { useLocation } from 'react-router-dom';

export const MoviesCollectionsPage: FC = () => {
  // const location = useLocation();

  return (
    <div>
      <h1>movies</h1>;
      <VideoPlayerOverlay />
    </div>
  );
};
