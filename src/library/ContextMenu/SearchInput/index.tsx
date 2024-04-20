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
}: SearchInputProps) => {
  const activeTabId = useActiveTabId();
  const { getChainUi, setChainUiItem } = useChainUi();

  const chainUi = chainUiSection
    ? getChainUi(activeTabId, chainUiSection)
    : undefined;

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
              chainUi &&
              chainUiSection &&
              chainUiKey &&
              chainUi[chainUiKey].length > 0
            ) {
              setChainUiItem(activeTabId, chainUiSection, chainUiKey, '');
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
