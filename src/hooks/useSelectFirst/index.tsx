// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect } from 'react';
import type { UseSelectFirstProps } from './types';

export const useSelectFirst = ({
  isActive,
  onSelect,
  activeItem,
  searchTerm,
  getFiltered,
}: UseSelectFirstProps) => {
  // Side effects of search input changing.
  useEffect(() => {
    if (isActive && searchTerm !== '') {
      const newFilteredPallets = getFiltered(searchTerm);

      // If the currently selected pallet is not in the filtered list, select the first item.
      if (
        newFilteredPallets.length &&
        !newFilteredPallets.find((item: unknown) => {
          item === activeItem;
        })
      ) {
        onSelect(newFilteredPallets[0]);
      }
    }
  }, [searchTerm]);

  return null;
};
