import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import type { AssetType } from '../../../types/motion';
import { FaPlay } from 'react-icons/fa';
import classNames from 'classnames';

type PlayVideoButton =
  | {
      id: number;
      text: string;
      assetType: AssetType;
    }
  | PropsWithChildren<{
      id: number;
      icon: true;
      assetType: AssetType;
    }>;

export const PlayVideoButton: FC<PlayVideoButton> = (props) => {
  const handleOnClick = () => {
    window.vlc.open({
      id: props.id,
      assetType: props.assetType,
    });
  };

  if ('text' in props) {
    return (
      <button className="play-video play-video--button" onClick={handleOnClick}>
        {props.text}
      </button>
    );
  }

  return (
    <button className="play-video play-video--icon" onClick={handleOnClick}>
      {props.children}
      <div className=" play-video--icon-container">
        <FaPlay />
      </div>
    </button>
  );
};
