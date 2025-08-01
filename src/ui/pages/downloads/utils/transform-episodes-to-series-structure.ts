import type { DownloadedAssetMetadata } from '../../../../electron/controllers/download/types';

export type DownloadedSeries = {
  title: string;
  seriesId: number;
  seasons: {
    title: string;
    seasonId: number;
    seasonNumber: number;
    episodes: Omit<DownloadedAssetMetadata, 'seriesId' | 'seasonId'>[];
  }[];
};

const sortSeries = (series: DownloadedSeries[]): DownloadedSeries[] => {
  return series.map((currSeries) => {
    const seasons = currSeries.seasons
      .map((currSeason) => {
        const episodes = currSeason.episodes.sort((a, b) => (a?.episodeNumber ?? 0) - (b?.episodeNumber ?? 0));

        return { ...currSeason, episodes };
      })
      .sort((a, b) => (a?.seasonNumber ?? 0) - (b?.seasonNumber ?? 0));

    return { ...currSeries, seasons };
  });
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
        seasonNumber: episodeData.seasonNumber ?? 0,
        episodes: [],
      };
      acc[seriesId].seasons.push(season);
    }

    season.episodes.push({
      ...episodeData,
    });

    return acc;
  }, {});

  return sortSeries(Object.values(series));
};
