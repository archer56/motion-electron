import React from 'react';
import { VideoPlayerOverlay } from './components/video-player-overlay/video-player-overlay';

export const App = () => {
  const onMaximiseClick = () => {
    window.electronWindow.setFullscreen();
  };

  const onMinimiseClick = () => {
    window.electronWindow.unsetFullscreen();
  };

  return (
    <div>
      {/* <h1>react bitches</h1> */}
      <button onClick={onMaximiseClick}>Maximise</button>
      <button onClick={onMinimiseClick}>minimise</button>
      <VideoPlayerOverlay />
    </div>
  );
};
