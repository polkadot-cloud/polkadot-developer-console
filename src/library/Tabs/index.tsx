// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { TabWrapper, TabsWrapper } from 'library/Tabs/Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useTabs } from 'contexts/Tabs';
import { useRef, useState } from 'react';
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
import { Presentational } from './Presentational';
import { Tab } from './Tab';

export const Tabs = () => {
  const { tabs, setTabs, createTab, activeTabId, setActiveTabIndex } =
    useTabs();

  const [dragId, setDragId] = useState<number | null>(null);

  // Handle initial render logic.
  const initialRef = useRef<boolean>(true);
  const isInitial = initialRef.current === true;
  initialRef.current = false;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const activeTab = tabs.map((tab) => tab.id).indexOf(dragId || -1);
  const activeTabData = tabs[activeTab];

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setDragId(Number(active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over?.id && active.id !== over.id) {
      const oldIndex = tabs.map((tab) => tab.id).indexOf(active.id as number);
      const newIndex = tabs
        .map((tab) => tab.id)
        .indexOf((over?.id || -1) as number);
      const newTabs = arrayMove(tabs, oldIndex, newIndex);

      setTabs(newTabs);
      setActiveTabIndex(newTabs.map((tab) => tab.id).indexOf(activeTabId));
    }
    setDragId(null);
  };

  return (
    <TabsWrapper>
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
              dragIndex={activeTab ?? -1}
              id={id}
              name={name}
              index={index}
              initial={isInitial}
            />
          ))}
          <TabWrapper onClick={() => createTab()} className="new">
            <FontAwesomeIcon icon={faPlus} className="icon" /> New
          </TabWrapper>
        </SortableContext>
        <DragOverlay>
          {activeTab !== null ? (
            <Presentational
              sortable={false}
              id={activeTabData?.id || -1}
              name={activeTabData?.name || ''}
              index={activeTab}
              initial={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </TabsWrapper>
  );
};
