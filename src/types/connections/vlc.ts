import type { AssetType } from '../../shared/motion';

export type OpenOptions = {
  assetType: AssetType;
  id: number;
};

export type TimeState = {
  current: number;
  total: number;
  remaining: number;
  position: number;
};

export type PlaybackState =
  | 'none'
  | 'idle'
  | 'opening'
  | 'buffering'
  | 'playing'
  | 'paused'
  | 'stopped'
  | 'ended'
  | 'error';

export type AudioSubtitleTrack = {
  id: number;
  name: string;
  active: boolean;
};
