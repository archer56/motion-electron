import type { AssetType, Episode, Movie, Series, SeriesType, allowedGenres } from '../../shared/motion';

import { useFetch } from './use-fetch';
import type { FetchReturn } from './use-fetch';
import qs from 'querystring';

type UseFetchAssetsBaseOptions = {
  assetType: AssetType;
  limit?: number;
  offset?: number;
};

type UseFetchAssetsOptions = UseFetchAssetsBaseOptions & {
  search?: string;
  shouldMakeCall?: boolean;
};

const hostname = 'https://motion.archers.world';

export const useFetchAssets = (
  options: UseFetchAssetsOptions,
): FetchReturn<{
  assets: Movie[] | Series[];
  totalAssets: number;
}> => {
  const query = qs.stringify({
    ...(options?.search && { search: options?.search }),
    ...(options?.limit && { limit: options?.limit }),
    ...(options?.offset && { offset: options?.offset }),
  });
  const path = options.search ? '/find' : '/all';

  return useFetch(`${hostname}/${options.assetType}${path}?${query}`, {
    shouldMakeCall: options?.shouldMakeCall ?? true,
  });
};

type UseFetchAssetsByGenreOptions = UseFetchAssetsBaseOptions & {
  genre: (typeof allowedGenres)[number];
};

export const useFetchAssetsByGenre = (
  options: UseFetchAssetsByGenreOptions,
): FetchReturn<{
  assets: Movie[] | Series[];
  totalAssets: number;
}> => {
  const query = qs.stringify({
    ...(options?.limit && { limit: options?.limit }),
    ...(options?.offset && { offset: options?.offset }),
  });

  return useFetch(`${hostname}/${options.assetType}/genre/${options.genre}?${query}`);
};

export const useFetchAssetsByRecentlyAdded = (
  options: UseFetchAssetsBaseOptions,
): FetchReturn<{
  assets: Movie[] | Series[];
  totalAssets: number;
}> => {
  const query = qs.stringify({
    ...(options?.limit && { limit: options?.limit }),
    ...(options?.offset && { offset: options?.offset }),
  });

  return useFetch(`${hostname}/${options.assetType}/recentlyadded?${query}`);
};

export const useFetchAssetsByContinueWatching = (
  options: UseFetchAssetsBaseOptions,
): FetchReturn<{
  assets: Movie[] | Series[];
  totalAssets: number;
}> => {
  const query = qs.stringify({
    ...(options?.limit && { limit: options?.limit }),
    ...(options?.offset && { offset: options?.offset }),
  });

  return useFetch(`${hostname}/${options.assetType}/continuewatching?${query}`);
};

type UseFetchAssetOptions = {
  assetType: AssetType;
  seriesType?: SeriesType;
  id: string;
};

export const useFetchAsset = (
  options: UseFetchAssetOptions,
): FetchReturn<{
  asset: Movie | Series | Episode;
}> => {
  if (options.assetType === 'series') {
    if (!options.seriesType) {
      return useFetch(`${hostname}/${options.assetType}/find/${options.id}`);
    }

    return useFetch(`${hostname}/${options.assetType}/find/${options.seriesType}/${options.id}`);
  }

  return useFetch(`${hostname}/${options.assetType}/find/${options.id}`);
};

type UseFetchVideoMetadataOptions = {
  id: string;
  assetType: AssetType;
};

type UseFetchVideoMetadataResponse = FetchReturn<{
  data: {
    length: number;
    supportedOnWeb: boolean;
    error?: string;
  };
}>;

export const useFetchVideoMetadata = (
  options: UseFetchVideoMetadataOptions,
): FetchReturn<UseFetchVideoMetadataResponse> => {
  return useFetch(`${hostname}/${options.assetType}/metadata/${options.id}`);
};
