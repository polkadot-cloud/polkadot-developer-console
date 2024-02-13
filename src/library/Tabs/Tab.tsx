// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useRef, useState } from 'react';
import { TabWrapper } from './Wrappers';
import type { TabProps } from './types';
import { useEventListener } from 'usehooks-ts';
import { useTabs } from 'contexts/Tabs';
import { useMenu } from 'contexts/Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Menu } from './Menu';
export const Tab = ({ index, id, name, initial }: TabProps) => {
  const {
    tabs,
    destroyTab,
    activeTabId,
    tabHoverIndex,
    activeTabIndex,
    setActiveTabId,
    instantiatedIds,
    setTabHoverIndex,
    setActiveTabIndex,
    addInstantiatedId,
  } = useTabs();
  const { openMenu } = useMenu();

  const tabRef = useRef<HTMLDivElement>(null);

  const [destroying, setDestroying] = useState<boolean>(false);

  // Whether the tab is instantiated on this render.
  const isInstantiated = instantiatedIds.includes(id);

  // Update the tab to instantiated.
  addInstantiatedId(id);

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
      initial={!isInstantiated && !initial ? 'hidden' : 'show'}
      animate={!isInstantiated ? 'show' : destroying ? 'hidden' : false}
      variants={{
        hidden: {
          width: 0,
          transition: {
            duration: 0.125,
            ease: 'easeOut',
          },
        },
        show: {
          width: 135,
          transition: {
            duration: 0.3,
            ease: [0.1, 1, 0.1, 1],
          },
        },
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
            setDestroying(true);
            setTabHoverIndex(0);
            setTimeout(() => {
              destroyTab(index, id);
            }, 125);
          }}
        >
          <FontAwesomeIcon icon={faClose} transform="shrink-1" />
        </button>
      )}
    </TabWrapper>
  );
};
