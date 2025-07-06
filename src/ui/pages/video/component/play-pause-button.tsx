import type { FC } from 'react';
import React from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';

type PlayPauseButtonProps = {
  isPaused: boolean;
  onPauseUpdate: (pauseState: boolean) => void;
};

export const PlayPauseButton: FC<PlayPauseButtonProps> = (props) => {
  const handleClick = () => {
    props.onPauseUpdate(!props.isPaused);
  };

  return (
    <button className="play-pause-button" onClick={handleClick}>
      {props.isPaused ? (
        <FaPlay className="play-pause-button__icon" />
      ) : (
        <FaPause className="play-pause-button__icon" />
      )}
    </button>
  );
};
