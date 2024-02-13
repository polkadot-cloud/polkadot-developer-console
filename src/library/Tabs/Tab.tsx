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
import { Menu } from './Menu';
export const Tab = ({ index, id, name }: TabProps) => {
  const {
    tabs,
    destroyTab,
    activeTabId,
    tabHoverIndex,
    activeTabIndex,
    setActiveTabId,
    setTabHoverIndex,
    setActiveTabIndex,
  } = useTabs();
  const { openMenu } = useMenu();

  const tabRef = useRef<HTMLDivElement>(null);

  // Handle context menu when tab is right clicked.
  const handleTabContextMenu = (ev: MouseEvent): void => {
    ev.preventDefault();
    openMenu(ev, <Menu />);
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
      <div className="fade" />
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
