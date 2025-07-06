import type { FC } from 'react';
import React from 'react';
import { VideoPlayerOverlay } from '../../components/video-player-overlay/video-player-overlay';

export const VideoPage: FC = () => {
  return (
    <div>
      <h1>Video</h1>;
      <VideoPlayerOverlay />
    </div>
  );
};
