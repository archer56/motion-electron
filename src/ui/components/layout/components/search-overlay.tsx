import classNames from 'classnames';
import React from 'react';
import type { FC, PropsWithChildren } from 'react';

type SearchOverlayProps = {
  open: boolean;
};

export const SearchOverlay: FC<PropsWithChildren<SearchOverlayProps>> = (props) => {
  const overlayClassName = classNames('search-overlay', {
    'search-overlay--open': props.open,
  });

  return <div className={overlayClassName}>{props.children}</div>;
};
