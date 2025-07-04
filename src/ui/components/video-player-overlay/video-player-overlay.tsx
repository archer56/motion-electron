import type { FC } from 'react';
import React, { useEffect } from 'react';

export const VideoPlayerOverlay: FC = () => {
  useEffect(() => {
    setInterval(() => {
      window.vlc.timeState().then((time) => {
        console.log('timestate', time);
      });
    }, 1000);
  });

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

  const handleSeek = async () => {
    console.log('seeking');
    const timestate = await window.vlc.timeState();

    window.vlc.seek(timestate.current + 20000);
  };

  return (
    <div>
      video
      <button onClick={handleInit}>init!</button>
      <button onClick={handleClose}>close!</button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handlePlay}>Play</button>
      <button onClick={handleSeek}>Seek</button>
    </div>
  );
};
