import type { ChangeEvent, FC } from 'react';
import React, { useEffect, useRef } from 'react';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import classNames from 'classnames';
import { IoMdClose } from 'react-icons/io';

type SearchBarProps = {
  isOpen: boolean;
  onChange: (searchTerm: string) => void;
  onOpenToggle: () => void;
  className?: string;
};

export const SearchBar: FC<SearchBarProps> = (props) => {
  const searchBarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchBarRef?.current) {
      searchBarRef.current.value = '';
      props.onChange('');
    }
  }, [props.isOpen]);

  const handleOpen = () => {
    props.onOpenToggle();
    setTimeout(() => {
      searchBarRef.current?.focus();
    }, 0);
  };

  const handleClose = () => {
    props.onOpenToggle();
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.value ?? '');
  };

  const searchBarClassName = classNames('search-bar', props.className);
  const searchBoxClassName = classNames('search-bar__search-box', {
    'search-bar__search-box--open': props.isOpen,
  });

  return (
    <div className={searchBarClassName}>
      {props.isOpen ? (
        <IoMdClose className="search-bar__icon" onClick={handleClose} />
      ) : (
        <HiMagnifyingGlass className="search-bar__icon" onClick={handleOpen} />
      )}
      <input type="text" className={searchBoxClassName} ref={searchBarRef} onChange={handleOnChange} />
    </div>
  );
};
