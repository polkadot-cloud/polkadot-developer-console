// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useRef } from 'react';
import { TabWrapper } from './Wrappers';
import type { TabProps } from './types';
import { useEventListener } from 'usehooks-ts';
import { useTabs } from 'contexts/Tabs';
import { useMenu } from 'contexts/Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

export const Tab = ({ index, id, name }: TabProps) => {
  const { openMenu, setMenuInner } = useMenu();
  const {
    tabs,
    activeTabId,
    setActiveTabId,
    activeTabIndex,
    setActiveTabIndex,
    tabHoverIndex,
    setTabHoverIndex,
    destroyTab,
  } = useTabs();

  const tabRef = useRef<HTMLDivElement>(null);

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
      className={`${activeTabId === id ? `active ` : ``}${index === activeTabIndex - 1 || index === tabHoverIndex - 1 ? `hide-border` : ``}`}
      onMouseOver={() => {
        setTabHoverIndex(index);
      }}
      onMouseLeave={() => {
        setTabHoverIndex(0);
      }}
    >
      <button
        className="name"
        onClick={() => {
          setActiveTabId(id);
          setActiveTabIndex(index);
        }}
      >
        {name}
      </button>

      {tabs.length > 1 && (
        <button
          className="close"
          onClick={() => {
            setTabHoverIndex(0);
            destroyTab(index, id);
          }}
        >
          <FontAwesomeIcon icon={faClose} transform="shrink-1" />
        </button>
      )}
    </TabWrapper>
  );
};
