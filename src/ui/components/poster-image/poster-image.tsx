import classNames from 'classnames';
import type { FC, ReactElement } from 'react';
import React from 'react';

type PosterImageProps =
  | {
      src: string | undefined;
      direction: 'portrait' | 'landscape';
      alt?: string;
    }
  | {
      icon: ReactElement;
      direction: 'portrait' | 'landscape';
      alt?: string;
    };

export const PosterImage: FC<PosterImageProps> = (props) => {
  const className = classNames('poster-image__container', {
    'poster-image__container--landscape': props.direction === 'landscape',
    'poster-image__container--portrait': props.direction === 'portrait',
  });

  if ('icon' in props) {
    return (
      <div className={className}>
        <div className="poster-image__icon">{props.icon}</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <img src={props.src} className="poster-image__poster" alt={props.alt} />
    </div>
  );
};
