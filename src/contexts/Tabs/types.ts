import type { Dispatch, SetStateAction } from 'react';

export interface ActiveTab {
  name: string;
}

export type ActiveTabs = Record<string, ActiveTab>;

export interface TabsContextInterface {
  activeTabs: ActiveTabs;
  setActiveTabs: Dispatch<SetStateAction<ActiveTabs>>;
}
