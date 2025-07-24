import type { FC } from 'react';
import React from 'react';
import type { Episode } from '../../../../shared/motion';
import { PlayVideoButton } from '../../../components/play-video-button/play-video-button';

type EpisodeProps = {
  asset: Episode;
};

export const EpisodeItem: FC<EpisodeProps> = (props) => {
  const { id, posterSrc, title, description } = props.asset;

  return (
    <div className="episode-item">
      <PlayVideoButton id={id} assetType="series" icon>
        <div className="episode-item__poster-container">
          <img src={posterSrc} className="episode-item__poster" />
        </div>
      </PlayVideoButton>
      <div className="episode-item__meta">
        <p className="episode-item__title">{title}</p>
        <p className="episode-item__description">{description}</p>
      </div>
    </div>
  );
};
