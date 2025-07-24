import { getPlaybackUrl, setPlaybackPosition } from './playback';
import { download } from './download';
import { getMovie, getSeries, getMovieMetadata, getSeriesMetadata, getSeason } from './asset';
import { getNextEpisode } from './next-episode';
import { updateMetadata } from './metadata';
export { AssetType, Cast, Episode, Season, Series, Movie, SeriesType, allowedGenres } from './types';

export const motion = {
  getPlaybackUrl,
  download,
  getMovie,
  getSeries,
  getMovieMetadata,
  getSeriesMetadata,
  getNextEpisode,
  getSeason,
  setPlaybackPosition,
  updateMetadata,
};
