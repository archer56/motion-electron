import type { FC } from 'react';
import React from 'react';

export const VideoPlayerOverlay: FC = () => {
  const handlePlay = () => {
    window.vlc.play();
  };

  const handlePause = () => {
    window.vlc.pause();
  };

  const handleInit = () => {
    console.log('initing');

    window.vlc.open();
  };

  const handleClose = () => {
    console.log('closing');

    window.vlc.close();
  };

  return (
    <div>
      video
      <button onClick={handleInit}>init!</button>
      <button onClick={handleClose}>close!</button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handlePlay}>Play</button>
    </div>
  );
};
