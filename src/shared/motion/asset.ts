import axios from 'axios';
import { config } from '../../electron/config';
import type { AssetType, Episode, Id, Metadata, Movie, Season, Series, SeriesType } from './types';

type GetAssetOptions = {
  id: Id;
  assetType: AssetType;
  seriesType?: SeriesType;
};

const getAsset = async <T>(options: GetAssetOptions): Promise<T> => {
  const response = await (options.seriesType
    ? axios.get<{ asset: T }>(`${config.motion}/series/find/${options.seriesType}/${options.id}`)
    : axios.get<{ asset: T }>(`${config.motion}/${options.assetType}/find/${options.id}`));

  return response.data.asset;
};

type GetAssetMetadataOptions = {
  id: Id;
  assetType: AssetType;
  seriesType?: SeriesType;
};

const getAssetMetadata = async (options: GetAssetMetadataOptions): Promise<Metadata> => {
  const response = await axios.get<Metadata>(`${config.motion}/${options.assetType}/metadata/${options.id}`);
  return response.data;
};

type GetMovieOptions = {
  id: Id;
};

export const getMovie = (options: GetMovieOptions) => {
  return getAsset<Movie>({
    id: options.id,
    assetType: 'movies',
  });
};

type GetSeriesOptions = {
  id: Id;
};

export const getSeries = (options: GetSeriesOptions) => {
  return getAsset<Series>({
    id: options.id,
    assetType: 'series',
  });
};

type GetSeasonOptions = {
  id: Id;
};

export const getSeason = (options: GetSeasonOptions) => {
  return getAsset<Season>({
    id: options.id,
    assetType: 'series',
    seriesType: 'season',
  });
};

type GetEpisodeOptions = {
  id: Id;
};

export const getEpisode = (options: GetEpisodeOptions) => {
  return getAsset<Episode>({
    id: options.id,
    assetType: 'series',
    seriesType: 'episode',
  });
};

type GetMovieMetadataOptions = {
  id: Id;
};

export const getMovieMetadata = (options: GetMovieMetadataOptions) => {
  return getAssetMetadata({
    id: options.id,
    assetType: 'movies',
  });
};

type GetSeriesMetadataOptions = {
  id: Id;
};

export const getSeriesMetadata = (options: GetSeriesMetadataOptions) => {
  return getAssetMetadata({
    id: options.id,
    assetType: 'series',
  });
};
