type TimeState = {
  current: number;
  total: number;
  remaining: number;
  position: number;
};

type PlaybackState = 'idle' | 'opening' | 'buffering' | 'playing' | 'paused' | 'stopped' | 'ended' | 'error' | 'none';

export type VlcAddon = {
  /**
   * Initialises VLC - this should be called early as possible as it can be slow on windows
   */
  initialise: () => Promise<void>;

  /**
   * Opens a VLC window in fullscreen and plays the content
   */
  open: (url: string) => Promise<void>;

  /**
   * @windowsOnly
   * Forces the VLC window to reposition directly under the electron window
   */
  updateWindowPosition: (electronWindowHandle: bigint) => Promise<void>;

  /**
   * Closes the VLC window
   */
  close: () => Promise<void>;

  /**
   * Plays the content
   */
  play: () => Promise<void>;

  /**
   * Pauses the content
   */
  pause: () => Promise<void>;

  /**
   * Seeks to a position in the content using milliseconds
   */
  seekTo: (mm: number) => Promise<void>;

  /**
   * Gets the current time information
   * @returns An object containing time information about the content
   */
  getTimeState: () => Promise<TimeState>;

  /**
   * Gets the playback state
   * @returns An string detailing the current playback state
   */
  getPlaybackState: () => Promise<PlaybackState>;
};
