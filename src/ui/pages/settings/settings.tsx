import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { MdDevices } from 'react-icons/md';
import { GrServer } from 'react-icons/gr';
import { PanelItem } from './components/panel-item';
import { SettingsPanel } from './constants';
import { ServerPanel } from './panels/server';
import { ClientPanel } from './panels/client';
import { useIsMotionOnline } from '../../hooks/use-fetch-motion';

const getPanelHash = (): SettingsPanel => {
  const pageHash = window.location.hash.replace('#', '');
  return pageHash in SettingsPanel ? (pageHash as SettingsPanel) : SettingsPanel.server;
};

export const SettingsPage: FC = () => {
  useIsMotionOnline();

  const [currentSettingsPanel, setSettingsPanel] = useState<SettingsPanel>(getPanelHash());

  const handlePanelItemClick = (id: SettingsPanel) => {
    window.location.hash = id;
    setSettingsPanel(() => id);
  };

  useEffect(() => {
    const handleHashChange = () => {
      setSettingsPanel(() => getPanelHash());
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="settings">
      <ul className="settings__side-panel">
        <PanelItem title="Back to Motion" icon={FaArrowLeftLong} to="/ui/movies" />
        <PanelItem title="Server" icon={GrServer} id={SettingsPanel.server} onClick={handlePanelItemClick} />
        <PanelItem title="Client" icon={MdDevices} id={SettingsPanel.client} onClick={handlePanelItemClick} />
      </ul>
      <div className="settings__panel">
        {currentSettingsPanel === SettingsPanel.server && <ServerPanel />}
        {currentSettingsPanel === SettingsPanel.client && <ClientPanel />}
      </div>
    </div>
  );
};
