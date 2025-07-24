import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import type { AssetType } from '../../../shared/motion';
import { MdDownload } from 'react-icons/md';
import classNames from 'classnames';

type DownloadButtonProps = {
  id: number;
  assetType: AssetType;
};
export const DownloadButton: FC<DownloadButtonProps> = (props) => {
  const [downloading, setDownloading] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    window.download.isInQueue(props.id).then((isInQueue) => {
      if (isInQueue) {
        setDownloading(() => true);
      }
    });

    window.download.isDownloaded(props.id).then((isDownloaded) => {
      setDownloaded(() => isDownloaded);
    });
  }, [props.id]);

  useEffect(() => {
    if (downloading) {
      intervalRef.current = setInterval(() => {
        window.download.getDownloadPercentage(props.id).then((percentage) => {
          setPercentage(() => percentage || 0);
        });
      }, 1000);
    }

    return () => {
      if (intervalRef?.current) {
        clearInterval(intervalRef?.current);
      }
    };
  }, [downloaded, downloading, props.id]);

  const onClickHandler = () => {
    setDownloading(() => true);
    window.download.addDownload(props.id);
  };

  const buttonClass = classNames('download-button', {
    'download-button--disabled': downloaded || downloading,
  });

  return (
    <button
      onClick={onClickHandler}
      className={buttonClass}
      style={{
        '--split': `${percentage}%`,
      }}
      disabled={downloaded || downloading}
    >
      <MdDownload />
    </button>
  );
};
