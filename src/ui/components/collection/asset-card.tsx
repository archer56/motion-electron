import React from 'react';
import type { FC } from 'react';
import type { Movie, Series } from '../../../types/motion';
import { Link } from 'react-router-dom';

type AssetCardProps =
  | {
      asset: Movie;
      type: 'movies';
    }
  | {
      asset: Series;
      type: 'series';
    };

export const AssetCard: FC<AssetCardProps> = (props) => {
  const posterSrc = props.asset.posterSrc?.replace('original', 'w200');
  const to = `/${props.type}/${props.asset.id}`;

  return (
    <li className="asset-card">
      <Link to={to}>
        <img className="asset-card__image" src={posterSrc} alt={props.asset.title} />
      </Link>
    </li>
  );
};
