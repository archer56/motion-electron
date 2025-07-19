import React from 'react';
import type { FC } from 'react';
import type { IconType } from 'react-icons';
import type { SettingsPanel } from '../constants';
import { Link } from 'react-router-dom';

type PanelItemProps = PanelItemLinkProps | PanelItemButtonProps;

type PanelItemBaseProps = {
  title: string;
  icon: IconType;
};

type PanelItemLinkProps = PanelItemBaseProps & {
  to: `/${string}`;
};

type PanelItemButtonProps = PanelItemBaseProps & {
  id: SettingsPanel;
  onClick: (id: SettingsPanel) => void;
};

export const PanelItem: FC<PanelItemProps> = (props) => {
  const { icon: Icon } = props;

  if ('to' in props) {
    return (
      <Link to={props.to} className="panel-item__link">
        <div className="panel-item__icon-container">
          <Icon />
        </div>
        <span className="panel-item__text panel-item__text--hide-mobile">{props.title}</span>
      </Link>
    );
  }

  const handleOnClick = () => {
    props.onClick(props.id);
  };

  return (
    <li onClick={handleOnClick} className="panel-item">
      <div className="panel-item__link-container panel-item__link-container--hide-mobile">
        <Icon />
      </div>
      <span className="panel-item__text">{props.title}</span>
    </li>
  );
};
