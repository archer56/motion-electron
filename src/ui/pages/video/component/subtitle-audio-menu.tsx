import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { SubtitleAudioMenuList } from './subtitle-audio-menu-list';
import type { AudioSubtitleTrack } from '../../../../types/connections/vlc';
import classNames from 'classnames';

type SubtitleAudioMenuProps = {
  visible: boolean;
};

export const SubtitleAudioMenu: FC<SubtitleAudioMenuProps> = (props) => {
  const [subtitleList, setSubtitleList] = useState<AudioSubtitleTrack[]>([]);
  const [audioList, setAudioList] = useState<AudioSubtitleTrack[]>([]);

  useEffect(() => {
    if (!props.visible) {
      return;
    }

    window.vlc.getSubtitleTracks().then((list) => {
      setSubtitleList(() => list);
    });

    window.vlc.getAudioTracks().then((list) => {
      setAudioList(() => list);
    });
  }, [props.visible]);

  const handleSubtitleClick = (id: number) => {
    setSubtitleList((prev) =>
      prev.map((subtitle) => ({
        ...subtitle,
        active: subtitle.id === id,
      })),
    );

    window.vlc.setSubtitleTrack(id);
  };

  const handleAudioClick = (id: number) => {
    setAudioList((prev) =>
      prev.map((audio) => ({
        ...audio,
        active: audio.id === id,
      })),
    );

    window.vlc.setAudioTrack(id);
  };

  const className = classNames('subtitle-audio-menu', {
    'subtitle-audio-menu--hidden': !props.visible,
  });

  return (
    <div className={className}>
      <SubtitleAudioMenuList title="Subtitles" list={subtitleList} onClick={handleSubtitleClick} />
      <SubtitleAudioMenuList title="Audio" list={audioList} onClick={handleAudioClick} />
    </div>
  );
};
