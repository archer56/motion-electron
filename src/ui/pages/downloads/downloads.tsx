import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useIsMotionOnline } from '../../hooks/use-fetch-motion';
import type { DownloadedAssetMetadata } from '../../../electron/controllers/download/types';

export const DownloadsPage: FC = () => {
  useIsMotionOnline();
  const [downloads, setDownloads] = useState<DownloadedAssetMetadata[]>([]);

  useEffect(() => {
    window.download.getDownloadedAssets().then((downloadedAssets) => {
      setDownloads(() => downloadedAssets);
    });
  }, []);

  return (
    <div className="downloads">
      <ul>
        {downloads.map((download) => (
          <li key={download.id}>{download.title}</li>
        ))}
      </ul>
    </div>
  );
};
