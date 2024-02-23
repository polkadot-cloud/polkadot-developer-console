// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { TabsWrapper } from 'library/Tabs/Wrappers';
import { useTabs } from 'contexts/Tabs';
import { useRef } from 'react';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { TabOverlay } from './TabOverlay';
import { Tab } from './Tab';
import { defaultEemptyTab } from 'contexts/Tabs/defaults';
import { Controls } from './Controls';

export const Tabs = () => {
  const {
    tabs,
    dragId,
    setTabs,
    setDragId,
    tabsHidden,
    activeTabId,
    setActiveTabIndex,
  } = useTabs();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle initial render. Used for tabs to prevent its initial animation.
  const initialRef = useRef<boolean>(true);
  const isInitial = initialRef.current === true;
  initialRef.current = false;

  // Handler for starting a drag. Sets the id of the tab being dragged.
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setDragId(Number(active.id));
  };

  // Handler for ending a drag. Updates tab order and resets the drag id.
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over?.id && active.id !== over.id) {
      const oldIndex = tabs.map((tab) => tab.id).indexOf(Number(active.id));
      const newIndex = tabs.map(({ id }) => id).indexOf(Number(over?.id || -1));
      const newTabs = arrayMove(tabs, oldIndex, newIndex);

      setTabs(newTabs);
      setActiveTabIndex(newTabs.map((tab) => tab.id).indexOf(activeTabId));
    }
    setDragId(null);
  };

  // Determine drag tab index and drag tab data. Falls back to defaults if no tab is being dragged.
  const dragIndex = tabs.map((tab) => tab.id).indexOf(dragId || -1);
  const dragTab = tabs[dragIndex] || defaultEemptyTab;

  // Ref for tabs container.
  const tabContainerRef = useRef<HTMLDivElement>(null);

  return (
    <TabsWrapper
      ref={tabContainerRef}
      className={tabsHidden ? 'hidden' : undefined}
      initial={'show'}
      animate={!tabsHidden ? 'show' : 'hidden'}
      variants={{
        hidden: {
          height: 0,
        },
        show: {
          height: 'auto',
        },
      }}
      transition={{
        duration: 0.075,
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToHorizontalAxis]}
      >
        <SortableContext items={tabs} strategy={horizontalListSortingStrategy}>
          {tabs.map(({ id, name }, index: number) => (
            <Tab
              key={`tab_${index}_${id}}`}
              id={id}
              name={name}
              index={index}
              initial={isInitial}
            />
          ))}
        </SortableContext>
        <DragOverlay>
          {dragIndex !== null ? (
            <TabOverlay
              id={dragTab.id}
              name={dragTab.name}
              index={dragIndex}
              initial={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
      <Controls tabContainerRef={tabContainerRef} />
    </TabsWrapper>
  );
};
