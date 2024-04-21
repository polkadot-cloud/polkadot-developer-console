// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveTabId } from 'contexts/ActiveTab';
import { SearchWrapper } from '../Wrappers';
import type { SearchInputProps } from './types';
import { useChainUi } from 'contexts/ChainUi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandSparkles } from '@fortawesome/free-solid-svg-icons';

export const SearchInput = ({
  inputRef,
  value,
  chainUiKeys,
  chainUiSection,
  onChange,
  onEnter,
  onEscape,
  setSearchValue,
  searchValue,
}: SearchInputProps) => {
  const activeTabId = useActiveTabId();
  const { getChainUi, setChainUiItem, isChainUiValueEmpty } = useChainUi();

  const chainUi = chainUiSection
    ? getChainUi(activeTabId, chainUiSection)
    : undefined;

  // Check if chainUi is being used.
  const isChainUi = chainUi && chainUiSection && chainUiKeys;

  if (isChainUi) {
    console.log(chainUi[chainUiKeys.selectOnSearchKey]);
  }

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
              (isChainUi &&
                !isChainUiValueEmpty(
                  activeTabId,
                  chainUiSection,
                  chainUiKeys.searchKey
                )) ||
              // If a direct search value is being used, check if it is not empty.
              (searchValue && searchValue.length > 0)
            ) {
              if (isChainUi) {
                setChainUiItem(
                  activeTabId,
                  chainUiSection,
                  chainUiKeys.searchKey,
                  ''
                );
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
      {isChainUi && (
        <button
          className={`icon ${chainUi[chainUiKeys.selectOnSearchKey] === true ? 'active' : ''}`}
          onClick={() => {
            setChainUiItem(
              activeTabId,
              chainUiSection,
              chainUiKeys.selectOnSearchKey,
              !chainUi[chainUiKeys.selectOnSearchKey]
            );
          }}
        >
          <FontAwesomeIcon icon={faWandSparkles} transform="shrink-3" />
        </button>
      )}
    </SearchWrapper>
  );
};
