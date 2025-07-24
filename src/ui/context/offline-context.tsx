// OfflineContext.tsx
import type { FC, PropsWithChildren } from 'react';
import React, { createContext, useContext, useState } from 'react';

type OfflineContextState = {
  isOffline: boolean;
  isOnline: boolean;
  setOffline: (offline: boolean) => void;
};

const initialState: OfflineContextState = {
  isOffline: false,
  isOnline: true,
  setOffline: () => {},
};

const OfflineContext = createContext<OfflineContextState>(initialState);

type OfflineProviderProps = PropsWithChildren;
export const OfflineProvider: FC<OfflineProviderProps> = (props) => {
  const [isOffline, setOffline] = useState(!navigator.onLine);

  return (
    <OfflineContext.Provider value={{ isOffline, isOnline: !isOffline, setOffline }}>
      {props.children}
    </OfflineContext.Provider>
  );
};

export const useOffline = (): OfflineContextState => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
