// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

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
import {
  DEFAULT_TAB_WIDTH_PX,
  TAB_TRANSITION_DURATION_MS,
} from 'contexts/Tabs/defaults';
import { useApi } from 'contexts/Api';
import { ConnectionIcon } from './ConectionIcon';

export const Tab = ({ index, id, name, initial = false }: TabProps) => {
  const {
    tabs,
    dragId,
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
  const { getApiStatus } = useApi();

  const {
    listeners,
    transform,
    attributes,
    setNodeRef,
    transition,
    setActivatorNodeRef,
  } = useSortable({ id });

  // Get any api status for the tab, if present.
  const apiStatus = getApiStatus(id);

  // Update the tab to instantiated.
  addInstantiatedId(id);

  // Transform style for dragging.
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Whether the tab is being destroyed.
  const [destroying, setDestroying] = useState<boolean>(false);

  // Get the index of the current dragged tab, if any.
  const dragIndex = tabs.map((tab) => tab.id).indexOf(dragId || -1);

  // Is the tab instantiated on this render.
  const instantiated = instantiatedIds.includes(id);

  // Is the tab currently being dragged.
  const dragging = dragIndex === index;

  // Is the tab active or being dragged.
  const active = activeTabId === id || dragging;

  // Is this tab adjacent to the actve tab.
  const adjacentToActive = index === activeTabIndex - 1;

  // Is this tab adjacent to the hovered tab.
  const adjacentToHover = index === tabHoverIndex - 1;

  // Is this tab adjacent to the dragged tab.
  const adjacentToDragging = index === (dragIndex ?? -1) - 1;

  // Handle context menu when tab is right clicked.
  const handleTabContextMenu = (ev: MouseEvent): void => {
    ev.preventDefault();
    openMenu(ev, <Menu />);
  };

  // Context menu ref.
  const tabRef = useRef<HTMLDivElement | null>(null);

  // Listen to context menu events.
  useEventListener('contextmenu', handleTabContextMenu, tabRef);

  return (
    <TabWrapper
      ref={(el) => {
        setNodeRef(el);
        tabRef.current = el;
      }}
      className={`${active ? `active ` : ``}${adjacentToActive || adjacentToHover || adjacentToDragging ? `hide-border` : ``} ${dragging ? ` dragging` : ``}`}
      onMouseOver={() => setTabHoverIndex(index)}
      onMouseLeave={() => setTabHoverIndex(0)}
      initial={!instantiated && !initial ? 'hidden' : 'show'}
      animate={!instantiated ? 'show' : destroying ? 'hidden' : false}
      variants={{
        hidden: {
          width: 0,
          transition: {
            duration: 0.125,
            ease: 'easeOut',
          },
        },
        show: {
          width: DEFAULT_TAB_WIDTH_PX,
          transition: {
            duration: TAB_TRANSITION_DURATION_MS * 0.001,
            ease: [0.1, 1, 0.1, 1],
          },
        },
      }}
      style={style}
    >
      <button
        ref={setActivatorNodeRef}
        className="drag"
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
      <ConnectionIcon status={apiStatus} />
      <div className={`name ${apiStatus}`}>{name}</div>
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
