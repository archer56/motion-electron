import type { FC } from 'react';
import React from 'react';
import { MdForward10, MdReplay10 } from 'react-icons/md';

type SeekButtonProps = {
  onClick: () => void;
  direction: 'forward' | 'backward';
};

export const SeekButton: FC<SeekButtonProps> = (props) => {
  const handleClick = () => {
    props.onClick();
  };

  return (
    <button className="seek-button" onClick={handleClick}>
      {props.direction === 'forward' ? (
        <MdForward10 className="seek-button__icon" />
      ) : (
        <MdReplay10 className="seek-button__icon" />
      )}
    </button>
  );
};
