import type { FC } from 'react';
import React from 'react';
import { SlSpeech } from 'react-icons/sl';

type SubtitleAudioButtonProps = {
  onClick: () => void;
};

export const SubtitleAudioButton: FC<SubtitleAudioButtonProps> = (props) => {
  const handleClick = () => {
    props.onClick();
  };

  return (
    <button className="subtitle-audio-button" onClick={handleClick}>
      <SlSpeech className="subtitle-audio-button__icon" />
    </button>
  );
};
