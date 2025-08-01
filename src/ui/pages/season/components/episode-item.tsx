import type { FC } from 'react';
import React from 'react';
import type { Episode } from '../../../../shared/motion';
import { PlayVideoButton } from '../../../components/play-video-button/play-video-button';
import { DownloadButton } from '../../../components/download-button/download-button';

type EpisodeProps = {
  asset: Episode;
};

export const EpisodeItem: FC<EpisodeProps> = (props) => {
  const { id, posterSrc, title, description } = props.asset;

  return (
    <div className="episode-item">
      <PlayVideoButton id={id} assetType="series" posterSrc={posterSrc} />
      <div className="episode-item__meta">
        <p className="episode-item__title">{title}</p>
        <p className="episode-item__description">{description}</p>
      </div>
      <div className="episode-item__download-container">
        <DownloadButton id={id} assetType="series" key={id} />
      </div>
    </div>
  );
};
