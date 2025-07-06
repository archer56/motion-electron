import type { FC, PointerEventHandler, PropsWithChildren, TouchEventHandler } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { Timestamp } from './timestamp';

type ProgressBarProps = PropsWithChildren<{
  progress: number;
  length: number;
  onProgressChange: (newProgress: number) => void;
}>;

type CalculatePositionOptions = {
  progress: number;
  length: number;
};

const calculatePosition = (options: CalculatePositionOptions): number => {
  if (options.progress === 0 && options.length === 0) {
    return 0;
  }

  return (options.progress / options.length) * 100;
};

type CalculateProgressOptions = {
  position: number;
  length: number;
};

const calculateProgress = (options: CalculateProgressOptions): number => {
  const percentage = options.position / 100;
  console.log('🚀 ~ calculateProgress ~ percentage:', options.position, percentage, options.length);
  return Math.round(options.length * percentage);
};

export const ProgressBar: FC<ProgressBarProps> = (props) => {
  const [position, setPosition] = useState<number>(calculatePosition(props));
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPressed) {
      setPosition(() => calculatePosition(props));
    }
  }, [props.progress]);

  type UpdatePositionOptions = {
    clientX: number;
  };

  const updatePosition = (options: UpdatePositionOptions) => {
    if (!progressBarRef.current) {
      return;
    }

    const rect = progressBarRef.current.getBoundingClientRect();
    const x = options.clientX - rect.left;

    const newPosition = calculatePosition({
      length: rect.width,
      progress: x,
    });
    setPosition(() => newPosition);
  };

  const handleTouchStart: TouchEventHandler<HTMLDivElement> = (e) => {
    setIsPressed(() => true);
    const touch = e.touches[0];

    updatePosition({
      clientX: touch.clientX,
    });
  };

  const handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {
    const touch = e.touches[0];
    setIsPressed(() => true);

    updatePosition({
      clientX: touch.clientX,
    });
  };

  const handleTouchEnd: TouchEventHandler<HTMLDivElement> = () => {
    if (!isPressed) {
      return;
    }

    setIsPressed(() => false);

    const newProgress = calculateProgress({
      length: props.length,
      position,
    });

    props.onProgressChange(newProgress);
  };

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
    setIsPressed(() => true);

    updatePosition({
      clientX: e.clientX,
    });
  };

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (e) => {
    if (!isPressed) {
      return;
    }

    updatePosition({
      clientX: e.clientX,
    });
  };

  const handlePointerUp: PointerEventHandler<HTMLDivElement> = () => {
    if (!isPressed) {
      return;
    }

    setIsPressed(() => false);

    const newProgress = calculateProgress({
      length: props.length,
      position,
    });

    props.onProgressChange(newProgress);
  };

  const timestampProgress = calculateProgress({
    length: props.length,
    position,
  });

  return (
    <div className="progress-bar">
      <div
        ref={progressBarRef}
        className="progress-bar__container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div className="progress-bar__bar">
          <div className="progress-bar__progression" style={{ width: `${position}%` }} />
        </div>
      </div>
      {props.children}
      <div className="progress-bar__timestamps">
        <Timestamp milliseconds={timestampProgress} />
        <Timestamp milliseconds={props.length - timestampProgress} />
      </div>
    </div>
  );
};
