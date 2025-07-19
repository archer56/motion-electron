import type { FC } from 'react';
import React, { useState } from 'react';
import { Button } from '../../../components/button/button';
import axios from 'axios';

export const ServerPanel: FC = () => {
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [seriesLoading, setSeriesLoading] = useState(false);

  const updateMovies = async () => {
    setMoviesLoading(() => true);
    try {
      await axios.post(`https://motion.archers.world/metadata/movies/update`);
    } catch (e) {
      const errorMessage = (e as Error).message || '';
      console.error(`Failed to update movies, ${errorMessage}`);
    }
    setMoviesLoading(() => false);
  };

  const updateSeries = async () => {
    setSeriesLoading(() => true);
    try {
      await axios.post(`https://motion.archers.world/metadata/series/update`);
    } catch (e) {
      const errorMessage = (e as Error).message || '';
      console.error(`Failed to update movies, ${errorMessage}`);
    }
    setSeriesLoading(() => false);
  };

  return (
    <div>
      <h2 className="panel__title">Server</h2>
      <h3 className="panel__subtitle">MetaData</h3>
      <section className="">
        <p className="panel__text">Update the metadata:</p>
        <Button text="Movies" onClick={updateMovies} disabled={moviesLoading} className="panel__metadata-button" />
        <Button text="Series" onClick={updateSeries} disabled={seriesLoading} className="panel__metadata-button" />
      </section>
      <h3 className="panel__subtitle">Folders</h3>
    </div>
  );
};
