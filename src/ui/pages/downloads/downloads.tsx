import type { FC } from 'react';
import React from 'react';
import { useIsMotionOnline } from '../../hooks/use-fetch-motion';

export const DownloadsPage: FC = () => {
  useIsMotionOnline();
  return <div className="downloads">Downloads</div>;
};
