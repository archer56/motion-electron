import type { FC } from 'react';
import React from 'react';
import type { AudioSubtitleTrack } from '../../../../types/connections/vlc';
import { TiTick } from 'react-icons/ti';
import classNames from 'classnames';

type SubtitleAudioMenuListProps = {
  title: string;
  list: AudioSubtitleTrack[];
  onClick: (id: number) => void;
};

type MenuItemProps = {
  name: string;
  id: number;
  active: boolean;
  onClick: (id: number) => void;
};

const MenuItem: FC<MenuItemProps> = (props) => {
  const buttonClassName = classNames('subtitle-audio-menu-list__item-button', {
    'subtitle-audio-menu-list__item-button--active': props.active,
    'subtitle-audio-menu-list__item-button--not-active': !props.active,
  });

  const handleClick = () => {
    props.onClick(props.id);
  };

  return (
    <li className="subtitle-audio-menu-list__item">
      <button className={buttonClassName} onClick={handleClick}>
        {props.active && <TiTick className="subtitle-audio-menu-list__tick" />}
        {props.name}
      </button>
    </li>
  );
};

export const SubtitleAudioMenuList: FC<SubtitleAudioMenuListProps> = (props) => {
  return (
    <div className="subtitle-audio-menu-list">
      <p className="subtitle-audio-menu-list__title">{props.title}</p>
      <ul className="subtitle-audio-menu-list__list">
        {props.list.map(({ name, id, active }) => (
          <MenuItem key={id} id={id} name={name} active={active} onClick={props.onClick} />
        ))}
      </ul>
    </div>
  );
};
