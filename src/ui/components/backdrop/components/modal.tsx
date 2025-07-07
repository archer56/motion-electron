import type { FC } from 'react';
import React from 'react';
import { Button } from '../../button/button';

type ModalProps = {
  question: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const Modal: FC<ModalProps> = (props) => {
  if (!props.isOpen) return null;

  return (
    <div className="modal" onClick={props.onClose}>
      <div className="modal__box">
        <p className="modal__question">{props.question}</p>
        <Button text="Yes" onClick={props.onConfirm} state="success"></Button>
        <Button text="No" onClick={props.onClose} state="warning"></Button>
      </div>
    </div>
  );
};
