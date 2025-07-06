import type { AssetType } from '../motion';

export type OpenOptions = {
  assetType: AssetType;
  id: number;
};

export type CloseOptions = OpenOptions;

export type TimeState = {
  current: number;
  total: number;
  remaining: number;
  position: number;
};
