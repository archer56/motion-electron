import type { FC } from 'react';
import React from 'react';
import type { AssetType } from '../../../types/motion';

type PlayVideoButton = {
  id: number;
  text: string;
  assetType: AssetType;
};

export const PlayVideoButton: FC<PlayVideoButton> = (props) => {
  const handleOnClick = () => {
    window.vlc.open({
      id: props.id,
      assetType: props.assetType,
    });
  };

  return (
    <button className="play-video-button" onClick={handleOnClick}>
      {props.text}
    </button>
  );
};
