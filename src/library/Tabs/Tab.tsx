// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable react/display-name */

import { useRef, useState } from 'react';
import { TabWrapper } from './Wrappers';
import { useEventListener } from 'usehooks-ts';
import { useTabs } from 'contexts/Tabs';
import { useMenu } from 'contexts/Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Menu } from './Menu';
import type { TabProps } from './types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

  const buttonRef = useRef<HTMLButtonElement>(null);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [destroying, setDestroying] = useState<boolean>(false);

  // Whether the tab is instantiated on this render.
  const isInstantiated = instantiatedIds.includes(id);

  // Update the tab to instantiated.
  addInstantiatedId(id);

  // Handle context menu when tab is right clicked.
  const handleTabContextMenu = (ev: MouseEvent): void => {
    // ev.preventDefault();
    openMenu(ev, <Menu />);
  };

  // Listen to `contextmenu` events.
  useEventListener('contextmenu', handleTabContextMenu, buttonRef);

  return (
    <TabWrapper
      ref={setNodeRef}
      className={`${activeTabId === id ? `active ` : ``}${index === activeTabIndex - 1 || index === tabHoverIndex - 1 ? `hide-border` : ``} sortable`}
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
      {...listeners}
      {...attributes}
      style={style}
    >
      <div className="fade" />
      <button
        ref={buttonRef}
        className="name"
        onMouseDown={(ev) => {
          // Only handle left click.
          if (ev.button === 0) {
            setActiveTabId(id);
            setActiveTabIndex(index);
          }
        }}
      >
        {name}
      </button>

      {tabs.length > 1 && (
        <button
          className="close"
          onMouseDown={() => {
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
