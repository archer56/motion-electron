import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';

type PosterImageProps = {
  src: string;
  direction: 'portrait' | 'landscape';
  alt?: string;
};

export const PosterImage: FC<PosterImageProps> = (props) => {
  const className = classNames('poster-image__container', {
    'poster-image__container--landscape': props.direction === 'landscape',
    'poster-image__container--portrait': props.direction === 'portrait',
  });

  return (
    <div className={className}>
      <img src={props.src} className="poster-image__poster" alt={props.alt} />
    </div>
  );
};
