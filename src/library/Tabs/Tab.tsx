// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MouseEvent as ReactMouseEvent } from 'react';
import { useRef } from 'react';
import { TabWrapper } from './Wrappers';
import type { TabProps } from './types';
import { useEventListener } from 'usehooks-ts';
import { useTabs } from 'contexts/Tabs';
import { useMenu } from 'contexts/Menu';

export const Tab = ({ id, name, activeTabId }: TabProps) => {
  const { openMenu, setMenuInner } = useMenu();
  const { setActiveTabId } = useTabs();

  const tabRef = useRef<HTMLDivElement>(null);

  // Handle mouse over tab to change previous tab style.
  const handlePrevTab = (
    ev: ReactMouseEvent<HTMLDivElement, MouseEvent>,
    on: 'over' | 'out'
  ) => {
    if (ev.target instanceof HTMLElement) {
      const prevTabEl = document.getElementById(`tab-${id - 1}`);

      if (prevTabEl && !prevTabEl.classList.contains('active')) {
        if (on === 'over') {
          prevTabEl.style.setProperty(
            'border-right-color',
            'var(--background-default)'
          );
        } else {
          prevTabEl.style.removeProperty('border-right-color');
        }
      }
    }
  };

  // Handle context menu when tab is right clicked.
  const handleTabContextMenu = (ev: Event): void => {
    ev.preventDefault();
    setMenuInner(<span>Testing</span>);
    openMenu(ev as MouseEvent);
  };

  // Listen to `contextmenu` events.
  useEventListener('contextmenu', handleTabContextMenu, tabRef);

  return (
    <TabWrapper
      ref={tabRef}
      data-id={id}
      id={`tab-${id}`}
      className={`${activeTabId === id ? `active ` : ``}${id === activeTabId - 1 ? `pre-active` : ``}`}
      onClick={() => setActiveTabId(id)}
      onMouseOver={(ev) => handlePrevTab(ev, 'over')}
      onMouseOut={(ev) => handlePrevTab(ev, 'out')}
    >
      {name}
    </TabWrapper>
  );
};
