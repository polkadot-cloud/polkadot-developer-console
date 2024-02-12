// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useRef } from 'react';
import { TabWrapper } from './Wrappers';
import type { TabProps } from './types';
import { useEventListener } from 'usehooks-ts';
import { useTabs } from 'contexts/Tabs';

export const Tab = ({ id, name, active }: TabProps) => {
  const { setActiveTabId } = useTabs();

  const tabRef = useRef<HTMLDivElement>(null);

  // Handle context menu when tab is right clicked.
  const handleTabContextMenu = (e: Event): void => {
    e.preventDefault();
  };

  useEventListener('contextmenu', handleTabContextMenu, tabRef);

  return (
    <TabWrapper
      ref={tabRef}
      className={active ? 'active' : undefined}
      onClick={() => setActiveTabId(id)}
    >
      {name}
    </TabWrapper>
  );
};
