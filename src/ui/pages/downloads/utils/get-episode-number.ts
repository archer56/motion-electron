const padNumber = (num: number): string => {
  if (num < 10) {
    return `0${num}`;
  } else {
    return num.toString();
  }
};

export const getEpisodeNumber = (seasonNumber: number, episodeNumber: number) => {
  const season = padNumber(seasonNumber);
  const episode = padNumber(episodeNumber);

  return `S${season}E${episode}`;
};
