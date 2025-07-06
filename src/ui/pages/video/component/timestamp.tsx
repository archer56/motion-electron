import type { FC } from 'react';
import React from 'react';

type TimestampProps = {
  milliseconds: number;
};

const formattedMilliseconds = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const Timestamp: FC<TimestampProps> = (props) => {
  return <p className="timestamp">{formattedMilliseconds(props.milliseconds)}</p>;
};
