import type { FC } from 'react';
import React, { useState } from 'react';
import { Year } from './components/year';
import { Runtime } from './components/runtime';
import { PlayVideoButton } from '../play-video-button/play-video-button';
import { Button } from '../button/button';
import { Modal } from './components/modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { AssetType } from '../../../types/motion';
import { useFetchNextEpisode } from '../../hooks/use-fetch-motion';

type BackdropProps = {
  id: number;
  title: string;
  src: string;
  description: string;
  date: string;
  runtime?: number;
  assetType: AssetType;
};

export const Backdrop: FC<BackdropProps> = (props) => {
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const { data } = useFetchNextEpisode({ seriesId: props.id });

  const navigate = useNavigate();

  const removeAsset = async () => {
    setRemoveModalOpen(false);

    try {
      // await axios.post(`/metadata/${props.assetType}/remove/${props.id}`);
      // this wont work if you have played video
      // navigate(-1);
    } catch (e) {
      const errorMessage = (e as Error).message || '';
      console.error(`Failed to update movies, ${errorMessage}`);
    }
  };

  const openRemoveModal = () => {
    setRemoveModalOpen(true);
  };

  const closeRemoveModal = () => {
    setRemoveModalOpen(false);
  };

  return (
    <div className="backdrop">
      <div className="backdrop__container">
        <img className="backdrop__image" src={props.src} />
      </div>
      <div className="backdrop__overlay">
        <h1 className="backdrop__title">{props.title}</h1>
        <div className="backdrop__metadata">
          <Year date={props.date} />
          {props.runtime && <Runtime time={props?.runtime} />}
        </div>
        <p className="backdrop__description">{props.description}</p>
        <div className="backdrop__buttons">
          <PlayVideoButton id={data?.asset?.id ?? 0} text="Continue watching" assetType={props.assetType} />
          <Button text="Remove" onClick={openRemoveModal} state="warning" />
        </div>
      </div>
      <Modal isOpen={removeModalOpen} question="Are you sure?" onClose={closeRemoveModal} onConfirm={removeAsset} />
    </div>
  );
};
