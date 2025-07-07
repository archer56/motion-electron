import type { FC } from 'react';
import React from 'react';

type RuntimeProps = {
  time: number;
};

function minutesToHHMMSS(minutes: number): string {
  const totalSeconds = minutes * 60;
  const hours = Math.floor(totalSeconds / 3600);
  const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = hours.toString().padStart(2, '0');
  const mm = remainingMinutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');

  return `${hh}:${mm}:${ss}`;
}

export const Runtime: FC<RuntimeProps> = (props) => {
  return <p className="runtime">{minutesToHHMMSS(props.time)}</p>;
};
