import type { DownloadedAssetMetadata } from '../../../../electron/controllers/download/types';

export type DownloadedSeries = {
  title: string;
  seriesId: number;
  seasons: {
    title: string;
    seasonId: number;
    episodes: Omit<DownloadedAssetMetadata, 'seriesId' | 'seasonId'>[];
  }[];
};

export const transformEpisodesToSeriesStructure = (episodes: DownloadedAssetMetadata[]): DownloadedSeries[] => {
  const series = episodes.reduce<Record<number, DownloadedSeries>>((acc, currEpisode) => {
    const { seriesId, seriesTitle, seasonId, seasonTitle, ...episodeData } = currEpisode;
    if (!seriesId || !seriesTitle || !seasonId || !seasonTitle) {
      return acc;
    }

    if (!acc[seriesId]) {
      acc[seriesId] = {
        title: seriesTitle,
        seriesId: seriesId,
        seasons: [],
      };
    }

    let season = acc[seriesId].seasons.find?.((s) => s.seasonId === seasonId);
    if (!season) {
      season = {
        seasonId,
        title: seasonTitle,
        episodes: [],
      };
      acc[seriesId].seasons.push(season);
    }

    season.episodes.push({
      ...episodeData,
    });

    return acc;
  }, {});

  return Object.values(series);
};
