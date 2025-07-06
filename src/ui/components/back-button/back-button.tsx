import type { FC } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from 'react-icons/fa6';
import classNames from 'classnames';

type BackButtonProps = {
  className?: string;
  onClick?: () => void;
};

export const BackButton: FC<BackButtonProps> = (props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (props?.onClick) {
      props.onClick();
      return;
    }

    navigate(-1);
  };

  const className = classNames('back-button', props.className);

  return (
    <button onClick={handleClick} className={className}>
      <FaArrowLeftLong className="back-button__arrow" />
    </button>
  );
};
