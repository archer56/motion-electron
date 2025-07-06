import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { AssetType } from '../../../types/motion';
import type { PlaybackState, TimeState } from '../../../types/connections/vlc';
import { BackButton } from '../../components/back-button/back-button';
import { ProgressBar } from './component/progress-bar';
import { PlayPauseButton } from './component/play-pause-button';
import classNames from 'classnames';

export const VideoPage: FC = () => {
  const params = useParams();
  const vlcIntervalRef = useRef<NodeJS.Timeout>(null);
  const overlayTimeoutRef = useRef<NodeJS.Timeout>(null);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackState>('idle');
  const [timeState, setTimeState] = useState<TimeState>({
    current: 0,
    position: 0,
    remaining: 0,
    total: 0,
  });
  const [overlayHidden, setOverlayHidden] = useState<boolean>(true);

  const hideOverlay = () => {
    if (playbackStatus === 'paused') {
      return;
    }

    if (overlayTimeoutRef.current) {
      clearTimeout(overlayTimeoutRef.current);
    }

    overlayTimeoutRef.current = setTimeout(() => {
      setOverlayHidden(() => true);
    }, 2000);
  };

  const handleMouseMove = () => {
    if (overlayHidden) {
      setOverlayHidden(false);
      hideOverlay();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      const isPaused = playbackStatus === 'paused';
      onPauseUpdate(isPaused ? false : true);
    }
  };

  useEffect(() => {
    vlcIntervalRef.current = setInterval(() => {
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

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [overlayHidden, playbackStatus]);

  useEffect(() => {
    console.log('usssse');
    if (playbackStatus === 'playing') {
      hideOverlay();
    } else if (playbackStatus === 'paused') {
      setOverlayHidden(() => false);

      if (overlayTimeoutRef?.current) {
        clearTimeout(overlayTimeoutRef.current);
      }
    }
  }, [playbackStatus]);

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

  const videoPlayerClass = classNames('video-player', {
    'video-player--hidden': overlayHidden,
  });

  return (
    <div className={videoPlayerClass}>
      <BackButton onClick={handleClose} />
      <ProgressBar progress={timeState.current} length={timeState.total} onProgressChange={onProgressChange}>
        <PlayPauseButton isPaused={playbackStatus === 'paused'} onPauseUpdate={onPauseUpdate} />
      </ProgressBar>
    </div>
  );
};
