import type { FC } from 'react';
import React from 'react';

type YearProps = {
  date: string;
};

export const Year: FC<YearProps> = (props) => {
  const year = new Date(props.date).getFullYear();

  return <p className="year">{year}</p>;
};
