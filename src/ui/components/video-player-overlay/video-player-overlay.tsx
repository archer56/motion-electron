import type { FC } from 'react';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { AssetType } from '../../../types/motion';

export const VideoPlayerOverlay: FC = () => {
  const params = useParams();

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

    window.vlc.open({
      assetType: 'movies',
      id: 123,
    });
  };

  const handleClose = () => {
    console.log('closing');

    window.vlc.close({
      assetType: params.assetType as AssetType,
      id: Number(params.id),
    });
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
