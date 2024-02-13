// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable react/display-name */

import type { RefObject } from 'react';
import { useState } from 'react';
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

export const Tab = ({ index, id, name, initial, dragIndex }: TabProps) => {
  const {
    tabs,
    destroyTab,
    activeTabId,
    tabHoverIndex,
    activeTabIndex,
    setActiveTabId,
    instantiatedIds,
    setActiveTabIndex,
    setTabHoverIndex,
    addInstantiatedId,
  } = useTabs();
  const { openMenu } = useMenu();

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });

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
    ev.preventDefault();
    openMenu(ev, <Menu />);
  };

  // Listen to `contextmenu` events.
  useEventListener(
    'contextmenu',
    handleTabContextMenu,
    setActivatorNodeRef as unknown as RefObject<HTMLElement>
  );

  const dragging = dragIndex === index;
  const active = activeTabId === id || dragging;
  const adjacentToHover = index === tabHoverIndex - 1;
  const adjacentToActive = index === activeTabIndex - 1;
  const adjacentToDragging = index === dragIndex - 1;

  return (
    <TabWrapper
      ref={setNodeRef}
      className={`${active ? `active ` : ``}${adjacentToActive || adjacentToHover || adjacentToDragging ? `hide-border` : ``} ${dragging ? ` sortable` : ``}`}
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
      style={style}
    >
      <button
        className="drag"
        ref={setActivatorNodeRef}
        onMouseDown={(ev) => {
          // Only handle left click.
          if (ev.button === 0) {
            setActiveTabId(id);
            setActiveTabIndex(index);
          }
        }}
        {...attributes}
        {...listeners}
      />
      <button className="name">{name}</button>
      <div className="fade" />

      {tabs.length > 1 && (
        <button
          className="close"
          onMouseUp={() => {
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
