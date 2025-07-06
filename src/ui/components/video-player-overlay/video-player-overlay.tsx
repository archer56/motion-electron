import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { AssetType } from '../../../types/motion';
import type { PlaybackState } from '../../../types/connections/vlc';

export const VideoPlayerOverlay: FC = () => {
  const params = useParams();
  const timestateRef = useRef<NodeJS.Timeout>(null);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackState>('idle');

  useEffect(() => {
    timestateRef.current = setInterval(() => {
      console.log('polling');
      window.vlc.playbackState().then((status) => {
        setPlaybackStatus(() => status);
      });
    }, 300);

    return () => {
      if (timestateRef?.current) {
        clearInterval(timestateRef?.current);
      }
    };
  }, []);

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

  if (playbackStatus === 'opening' || playbackStatus === 'buffering' || playbackStatus === 'idle') {
    return <h1>BUFFERING</h1>;
  }

  if (playbackStatus === 'ended' || playbackStatus === 'error' || playbackStatus === 'stopped') {
    handleClose();
  }

  return (
    <div>
      video
      <button onClick={handleInit}>init!</button>
      <button onClick={handleClose}>close!</button>
      {playbackStatus === 'playing' ? (
        <button onClick={handlePause}>Pause</button>
      ) : (
        <button onClick={handlePlay}>Play</button>
      )}
      <button onClick={handleSeek}>Seek</button>
    </div>
  );
};
