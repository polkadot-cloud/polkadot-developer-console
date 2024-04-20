// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveTabId } from 'contexts/ActiveTab';
import { SearchWrapper } from '../Wrappers';
import type { SearchInputProps } from './types';
import { useChainUi } from 'contexts/ChainUi';

export const SearchInput = ({
  inputRef,
  value,
  chainUiKey,
  chainUiSection,
  onChange,
  onEnter,
  onEscape,
  setSearchValue,
  searchValue,
}: SearchInputProps) => {
  const activeTabId = useActiveTabId();
  const { getChainUi, setChainUiItem } = useChainUi();

  const chainUi = chainUiSection
    ? getChainUi(activeTabId, chainUiSection)
    : undefined;

  // Check if chainUi is being used.
  const isChainUi = chainUi && chainUiSection && chainUiKey;

  return (
    <SearchWrapper>
      <input
        ref={inputRef}
        placeholder="Search"
        value={value}
        onChange={(ev) => onChange(ev)}
        onKeyDown={(ev) => {
          // Enter key action.
          if (ev.key === 'Enter') {
            onEnter();
          }
          if (ev.key === 'Escape') {
            // Escape action on non-empty search value.
            if (
              // If chainUi is being used, check if the currently selected item's search value is
              // not empty.
              (isChainUi && chainUi[chainUiKey].length > 0) ||
              // If a direct search value is being used, check if it is not empty.
              (searchValue && searchValue.length > 0)
            ) {
              if (isChainUi) {
                setChainUiItem(activeTabId, chainUiSection, chainUiKey, '');
              } else {
                if (typeof setSearchValue === 'function') {
                  setSearchValue('');
                }
              }
            } else {
              // Escape action on empty search value.
              onEscape();
            }
          }
        }}
      />
    </SearchWrapper>
  );
};
