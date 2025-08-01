import type { FC } from 'react';
import React from 'react';
import type { AssetType } from '../../../shared/motion';
import { FaPlay } from 'react-icons/fa';
import { PosterImage } from '../poster-image/poster-image';

type PlayVideoButton =
  | {
      id: number;
      text: string;
      assetType: AssetType;
    }
  | {
      id: number;
      posterSrc: string;
      assetType: AssetType;
    };

export const PlayVideoButton: FC<PlayVideoButton> = (props) => {
  const handleOnClick = () => {
    window.vlc.open({
      id: props.id,
      assetType: props.assetType,
    });
  };

  if ('posterSrc' in props) {
    const posterDirection = props.assetType === 'movies' ? 'portrait' : 'landscape';

    return (
      <button className="play-video play-video--icon" onClick={handleOnClick}>
        <PosterImage src={props.posterSrc} direction={posterDirection} />
        <div className=" play-video--icon-container">
          <FaPlay />
        </div>
      </button>
    );
  }

  return (
    <button className="play-video play-video--button" onClick={handleOnClick}>
      {props?.text}
    </button>
  );
};
