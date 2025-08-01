import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, type AssetType } from '../../../shared/motion';
import type { PlaybackState, TimeState } from '../../../types/connections/vlc';
import { BackButton } from '../../components/back-button/back-button';
import { ProgressBar } from './component/progress-bar';
import { PlayPauseButton } from './component/play-pause-button';
import classNames from 'classnames';
import { useFetchAsset } from '../../hooks/use-fetch-motion';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';

export const VideoPage: FC = () => {
  const params = useParams();
  const vlcIntervalRef = useRef<NodeJS.Timeout>(null);
  const overlayTimeoutRef = useRef<NodeJS.Timeout>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout>(null);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackState>('idle');
  const [timeState, setTimeState] = useState<TimeState>({
    current: 0,
    position: 0,
    remaining: 0,
    total: 0,
  });
  const [overlayHidden, setOverlayHidden] = useState<boolean>(true);
  const [initialSeekComplete, setInitialSeekComplete] = useState<boolean>(false);

  if (!params.assetType || !params.id) {
    return (
      <div className="video-player">
        <BackButton />
        <span>Something has gone wrong</span>
      </div>
    );
  }

  const assetType = params.assetType as AssetType;
  const id = Number(params.id);

  const asset = useFetchAsset({
    id: params.id,
    assetType,
    seriesType: assetType === 'series' ? 'episode' : undefined,
  });

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
    } else if (e.code === 'Escape') {
      handleClose();
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
    if (initialSeekComplete) {
      return;
    }

    const assetData = asset.data?.asset;
    if (!assetData) {
      return;
    }

    if (!assetData.id) {
      return;
    }

    const watchProgress = assetData?.watchProgress ?? 0;
    const seekablePlaybackStates: PlaybackState[] = ['playing', 'buffering'];

    if (watchProgress && seekablePlaybackStates.includes(playbackStatus)) {
      window.vlc.seek(watchProgress);
      setInitialSeekComplete(() => true);
    }
  }, [asset.data?.asset.id, playbackStatus, initialSeekComplete]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [overlayHidden, playbackStatus]);

  const updateProgress = async () => {
    if (playbackStatus !== 'playing') {
      return;
    }

    const state = await window.vlc.timeState();

    motion.setPlaybackPosition({
      id,
      assetType,
      current: state.current,
      percentage: state.position,
    });
  };

  useEffect(() => {
    updateIntervalRef.current = setInterval(() => {
      updateProgress();
    }, 3000);

    return () => {
      if (updateIntervalRef?.current) {
        clearInterval(updateIntervalRef?.current);
      }
    };
  }, [playbackStatus]);

  useEffect(() => {
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
    window.vlc.close();
  };

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

  const isLoading = playbackStatus === 'opening' || playbackStatus === 'buffering' || playbackStatus === 'idle';

  const videoPlayerClass = classNames('video-player', {
    'video-player--hidden': overlayHidden && !isLoading,
    'video-player--loading': isLoading,
  });

  return (
    <div className={videoPlayerClass}>
      {isLoading && <LoadingSpinner />}
      <div className="video-player__header">
        <BackButton onClick={handleClose} />
      </div>
      <div className="video-player__content">
        <h1 className="video-player__title">{asset?.data?.asset?.title}</h1>
      </div>
      <div className="video-player__footer">
        <ProgressBar progress={timeState.current} length={timeState.total} onProgressChange={onProgressChange}>
          <PlayPauseButton isPaused={playbackStatus === 'paused'} onPauseUpdate={onPauseUpdate} />
        </ProgressBar>
      </div>
    </div>
  );
};
