// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import { useRef } from 'react';
import { useEventListener } from 'usehooks-ts';
import type { UseBrowseListWithKeysProps } from './types';

export const useBrowseListWithKeys = ({
  listItems,
  listOpenRef,
  activeValue,
  onUpdate,
}: UseBrowseListWithKeysProps) => {
  // Handle key down events.
  const handleKeyDown = (ev: KeyboardEvent) => {
    const { type, key } = ev;
    const activeIndex = listItems.findIndex(
      (item: AnyJson) => item === activeValue
    );

    // Determine the new item index, defaulting to the active pallet if present in the filtered
    // list, otherwise 0
    let newIndex = activeIndex > listItems.length - 1 ? 0 : activeIndex;

    if (listOpenRef.current && type === 'keydown') {
      if (key === 'ArrowDown') {
        newIndex = Math.min(newIndex + 1, listItems.length - 1);
      } else if (key === 'ArrowUp') {
        newIndex = Math.max(newIndex - 1, 0);
      }

      // Update the active pallet if the index points to a valid filtered pallet.
      const newActiveItem = listItems[newIndex];
      if (newActiveItem) {
        onUpdate(newActiveItem);
      }
    }
  };

  // Listen for key down events for form control.
  const documentRef = useRef(document);
  useEventListener('keydown', handleKeyDown, documentRef);

  return;
};
