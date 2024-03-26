// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTabs } from 'contexts/Tabs';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

export const RenderedTabContext = createContext<number>(0);

export const useActiveTabId = () => useContext(RenderedTabContext);

export const RenderedTabProvider = ({ children }: { children: ReactNode }) => {
  const { selectedTabId } = useTabs();

  // Stores the currently rendered tab id.
  const [activeTabId, setActiveTabId] = useState<number>(selectedTabId);

  useEffect(() => {
    setActiveTabId(selectedTabId);
  }, [selectedTabId]);

  return (
    <RenderedTabContext.Provider value={activeTabId}>
      {children}
    </RenderedTabContext.Provider>
  );
};
