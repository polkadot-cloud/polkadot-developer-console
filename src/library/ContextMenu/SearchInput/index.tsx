// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveTab } from 'contexts/ActiveTab';
import { SearchWrapper } from '../Wrappers';
import type { SearchInputProps } from './types';
import { useChainUi } from 'contexts/ChainUi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWandSparkles,
  faDeleteLeft,
} from '@fortawesome/pro-duotone-svg-icons';

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
  const { tabId } = useActiveTab();
  const { getChainUi, setChainUiNamespace, isChainUiValueEmpty } = useChainUi();

  const chainUi = chainUiSection
    ? getChainUi(tabId, chainUiSection)
    : undefined;

  // Check if chainUi is being used.
  const isChainUi = chainUi && chainUiSection && chainUiKeys;

  return (
    <SearchWrapper>
      <div className="input">
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
                    tabId,
                    chainUiSection,
                    chainUiKeys.searchKey
                  )) ||
                // If a direct search value is being used, check if it is not empty.
                (searchValue && searchValue.length > 0)
              ) {
                if (isChainUi) {
                  setChainUiNamespace(
                    tabId,
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
        <button
          className="delete"
          onClick={() => {
            if (typeof setSearchValue === 'function') {
              setSearchValue('');
            }

            if (isChainUi) {
              setChainUiNamespace(
                tabId,
                chainUiSection,
                chainUiKeys.searchKey,
                ''
              );
            }
          }}
        >
          <FontAwesomeIcon icon={faDeleteLeft} transform="grow-1" />
        </button>
      </div>
      {isChainUi && (
        <button
          className={`icon ${chainUi[chainUiKeys.selectOnSearchKey] === true ? 'active' : ''}`}
          onClick={() => {
            setChainUiNamespace(
              tabId,
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
