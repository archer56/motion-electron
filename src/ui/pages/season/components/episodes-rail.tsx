import type { FC } from 'react';
import React from 'react';
import type { Episode } from '../../../../types/motion';
import { EpisodeItem } from './episode-item';

type EpisodesRailProps = {
  episodes: Episode[];
};

export const EpisodesRail: FC<EpisodesRailProps> = (props) => {
  if (!props.episodes.length) {
    return null;
  }

  const episodes = props.episodes.map((episode) => <EpisodeItem asset={episode} key={episode.id} />);

  return <ul>{episodes}</ul>;
};
