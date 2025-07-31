import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useIsMotionOnline } from '../../hooks/use-fetch-motion';
import type { DownloadedAssetMetadata } from '../../../electron/controllers/download/types';
import type { DownloadedSeries } from './utils/transform-episodes-to-series-structure';
import { transformEpisodesToSeriesStructure } from './utils/transform-episodes-to-series-structure';
import { PlayVideoButton } from '../../components/play-video-button/play-video-button';

export const DownloadsPage: FC = () => {
  useIsMotionOnline();
  const [downloads, setDownloads] = useState<{
    movies: DownloadedAssetMetadata[];
    series: DownloadedSeries[];
  }>({
    movies: [],
    series: [],
  });

  useEffect(() => {
    window.download.getDownloadedAssets().then((downloadedAssets) => {
      setDownloads({
        movies: downloadedAssets.movies,
        series: transformEpisodesToSeriesStructure(downloadedAssets.series),
      });
    });
  }, []);

  return (
    <div className="downloads">
      <p>Movies</p>
      <ul>
        {downloads.movies.map((movie) => (
          <li key={movie.id}>
            {movie.title} <PlayVideoButton id={movie.id} assetType="movies" text={'play'} />
          </li>
        ))}
      </ul>
      <p>Series</p>
      <ul>
        {downloads.series.map((series) => {
          return (
            <li key={series.seriesId}>
              <p>{series.title}</p>
              <ul>
                {series.seasons.map((season) => {
                  return (
                    <li key={season.seasonId}>
                      <p>{season.title}</p>
                      <ul>
                        {season.episodes.map((episode) => {
                          return (
                            <li key={episode.id}>
                              {episode.title} <PlayVideoButton id={episode.id} assetType="series" text={'play'} />
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
