import React from 'react';
import type { FC } from 'react';
import type { Movie, Season, Series } from '../../../shared/motion';
import { Link } from 'react-router-dom';

type AssetCardProps =
  | {
      asset: Movie;
      type: 'movies';
      includeTitle?: boolean;
    }
  | {
      asset: Series;
      type: 'series';
      includeTitle?: boolean;
    }
  | {
      asset: Season;
      type: 'season';
      includeTitle?: boolean;
    };

export const AssetCard: FC<AssetCardProps> = (props) => {
  const posterSrc = props.asset.posterSrc?.replace('original', 'w200');
  const to = `/${props.type}/${props.asset.id}`;
  const title = props.asset.title;

  return (
    <li className="asset-card">
      <div className="asset-card__image-container">
        <Link to={to}>
          <img className="asset-card__image" src={posterSrc} alt={title} />
        </Link>
      </div>
      {props.includeTitle && title && <p className="asset-card__title">{title}</p>}
    </li>
  );
};
