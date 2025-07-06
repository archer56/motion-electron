import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { AssetType } from '../../../types/motion';
import type { PlaybackState, TimeState } from '../../../types/connections/vlc';
import { BackButton } from '../../components/back-button/back-button';
import { ProgressBar } from './component/progress-bar';
import { PlayPauseButton } from './component/play-pause-button';

export const VideoPage: FC = () => {
  const params = useParams();
  const vlcIntervalRef = useRef<NodeJS.Timeout>(null);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackState>('idle');
  const [timeState, setTimeState] = useState<TimeState>({
    current: 0,
    position: 0,
    remaining: 0,
    total: 0,
  });
  console.log('🚀 ~ timeState:', timeState);

  useEffect(() => {
    vlcIntervalRef.current = setInterval(() => {
      console.log('polling');
      window.vlc.playbackState().then((status) => {
        setPlaybackStatus(() => status);
      });

      window.vlc.timeState().then((state) => {
        setTimeState(() => state);
      });
    }, 300);

    return () => {
      if (vlcIntervalRef?.current) {
        clearInterval(vlcIntervalRef?.current);
      }
    };
  }, []);

  const handleClose = () => {
    window.vlc.close({
      assetType: params.assetType as AssetType,
      id: Number(params.id),
    });
  };

  if (playbackStatus === 'opening' || playbackStatus === 'buffering' || playbackStatus === 'idle') {
    return (
      <div className="video-player">
        <BackButton />
        <span>BUFFERING@</span>
      </div>
    );
  }

  if (
    playbackStatus === 'ended' ||
    playbackStatus === 'error' ||
    playbackStatus === 'stopped' ||
    playbackStatus === 'none'
  ) {
    handleClose();
  }

  const onProgressChange = (newMs: number) => {
    window.vlc.seek(newMs);
  };

  const onPauseUpdate = (isPaused: boolean) => {
    if (isPaused) {
      window.vlc.pause();
    } else {
      window.vlc.play();
    }
  };

  return (
    <div className="video-player">
      <BackButton onClick={handleClose} />
      <ProgressBar progress={timeState.current} length={timeState.total} onProgressChange={onProgressChange}>
        <PlayPauseButton isPaused={playbackStatus === 'paused'} onPauseUpdate={onPauseUpdate} />
      </ProgressBar>
    </div>
  );
};
