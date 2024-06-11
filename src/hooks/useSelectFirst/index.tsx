// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { UseSelectFirstProps } from './types';
import { useEffectIgnoreInitial } from '@w3ux/hooks';

export const useSelectFirst = ({
  isActive,
  onSelect,
  activeItem,
  searchTerm,
  getFiltered,
}: UseSelectFirstProps) => {
  // Side effects of search input changing.
  useEffectIgnoreInitial(() => {
    if (isActive && searchTerm !== '') {
      const newFilteredPallets = getFiltered(searchTerm);

      // If the currently selected pallet is not in the filtered list, select the first item.
      if (
        newFilteredPallets.length === 0 ||
        newFilteredPallets.find((item: unknown) => item === activeItem) ===
          undefined
      ) {
        onSelect(newFilteredPallets[0]);
      }
    }
  }, [searchTerm]);

  return null;
};
