import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { ActiveTabs, TabsContextInterface } from './types';
import { defaultTabsContext } from './defaults';

export const TabsContext =
  createContext<TabsContextInterface>(defaultTabsContext);

export const useTabs = () => useContext(TabsContext);

export const TabsProvider = ({ children }: { children: ReactNode }) => {
  // Currently active tabs.
  const [activeTabs, setActiveTabs] = useState<ActiveTabs>({});

  return (
    <TabsContext.Provider
      value={{
        activeTabs,
        setActiveTabs,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};
