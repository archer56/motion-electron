import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';

type ButtonState = 'success' | 'warning' | 'default';

type ButtonProps = {
  text: string;
  state?: ButtonState;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
};

export const Button: FC<ButtonProps> = (props) => {
  const buttonClassname = classNames('button', props.className, {
    [`button-${props.state}`]: props.state,
    'button-disabled': props.disabled,
  });

  return (
    <button className={buttonClassname} onClick={props.onClick} disabled={props.disabled ?? false}>
      {props.text}
    </button>
  );
};
