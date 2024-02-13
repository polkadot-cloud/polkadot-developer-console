// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Entry } from '@polkadot-cloud/react';
import { TabWrapper, TabsWrapper } from 'library/Tabs/Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useTabs } from 'contexts/Tabs';
import { Header } from 'library/Header';
import { Footer } from 'library/Footer';
import { Tab } from 'library/Tabs/Tab';
import { Menu } from 'library/Menu';
import { useRef } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';

export const App = () => {
  const {
    tabs,
    getActiveTab,
    createTab,
    setTabs,
    setActiveTabIndex,
    activeTabId,
  } = useTabs();

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log(active, over);

    if (over?.id && active.id !== over.id) {
      const oldIndex = tabs.map((tab) => tab.id).indexOf(active.id as number);
      const newIndex = tabs
        .map((tab) => tab.id)
        .indexOf((over?.id || -1) as number);
      const newTabs = arrayMove(tabs, oldIndex, newIndex);

      setTabs(newTabs);
      setActiveTabIndex(newTabs.map((tab) => tab.id).indexOf(activeTabId));
    }
  };

  return (
    <Entry mode="light" theme={`polkadot-relay`}>
      <Menu />
      <Header />

      <TabsWrapper>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToHorizontalAxis]}
        >
          <SortableContext
            items={tabs}
            strategy={horizontalListSortingStrategy}
          >
            {tabs.map(({ id, name }, index: number) => (
              <Tab
                key={`tab_${index}_${id}}`}
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
        </DndContext>
      </TabsWrapper>

      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1>{getActiveTab()?.name || 'No ActiveTab'}</h1>
      </div>

      <Footer />
    </Entry>
  );
};
