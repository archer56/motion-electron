import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useIsMotionOnline } from '../../hooks/use-fetch-motion';
import type { DownloadedAssetMetadata } from '../../../electron/controllers/download/types';
import type { DownloadedSeries } from './utils/transform-episodes-to-series-structure';
import { transformEpisodesToSeriesStructure } from './utils/transform-episodes-to-series-structure';
import { PlayVideoButton } from '../../components/play-video-button/play-video-button';
import { PosterImage } from '../../components/poster-image/poster-image';
import { getEpisodeNumber } from './utils/get-episode-number';

export const DownloadsPage: FC = () => {
  useIsMotionOnline();
  const [downloads, setDownloads] = useState<{
    movies: DownloadedAssetMetadata[];
    series: DownloadedSeries[];
  }>({
    movies: [],
    series: [],
  });

  const [seriesExpanded, setSeriesExpanded] = useState<number | null>();

  useEffect(() => {
    window.download.getDownloadedAssets().then((downloadedAssets) => {
      setDownloads({
        movies: downloadedAssets.movies,
        series: transformEpisodesToSeriesStructure(downloadedAssets.series),
      });
    });
  }, []);

  const handleSeriesClick = (seriesId: number) => () => {
    setSeriesExpanded((prevSeriesId) => (prevSeriesId === seriesId ? null : seriesId));
  };

  return (
    <div className="downloads">
      <ul className="downloads__movie-list">
        {downloads.movies.map((movie) => (
          <li key={movie.id} className="downloads__item">
            <PlayVideoButton id={movie.id} assetType="movies" posterSrc={movie.posterSrc} />
            <div className="downloads__item-meta">
              <p className="downloads__item-title">{movie.title}</p>
              <p className="downloads__item-description">{movie.description}</p>
            </div>
          </li>
        ))}
      </ul>

      <ul className="downloads__series-list">
        {downloads.series.map((series) => {
          return (
            <li key={series.seriesId}>
              <div className="downloads__item downloads__item--series" onClick={handleSeriesClick(series.seriesId)}>
                <PosterImage src={series?.posterSrc} direction="portrait" />
                <div className="downloads__item-meta">
                  <p className="downloads__item-title">{series.title}</p>
                </div>
              </div>
              <ul className="downloads__season-list">
                {seriesExpanded === series.seriesId &&
                  series.seasons.map((season) => {
                    return (
                      <li key={season.seasonId}>
                        <p className="downloads__season-title">{season.title}</p>
                        <ul className="downloads__episode-list">
                          {season.episodes.map((episode) => {
                            const episodeNumber = getEpisodeNumber(
                              episode.seasonNumber ?? 0,
                              episode.episodeNumber ?? 0,
                            );
                            return (
                              <li key={episode.id} className="downloads__item">
                                <PlayVideoButton id={episode.id} assetType="series" posterSrc={episode.posterSrc} />
                                <div className="downloads__item-meta">
                                  <p className="downloads__item-title">
                                    {episodeNumber} - {episode.title}
                                  </p>
                                  <p className="downloads__item-description">{episode.description}</p>
                                </div>
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
