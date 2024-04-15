// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import {
  ChainResultWrapper,
  ChainResultsWrapper,
  ChainSearchInputWrapper,
} from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import type { ChainSearchInputProps } from './types';
import type { DirectoryId } from 'config/networks';
import { NetworkDirectory } from 'config/networks';

export const ChainSearchInput = ({
  onSearchFocused,
  onSearchBlurred,
  defaultDirectoryId,
}: ChainSearchInputProps) => {
  // Whether the input is in focused state.
  const [focused, setFocused] = useState<boolean>(false);

  // The current search value of the input.
  const [searchValue, setSearchValue] = useState<string>('');

  // The currently active chain (by directory id) of the input.
  const [directoryId, setDirectoryId] =
    useState<DirectoryId>(defaultDirectoryId);

  // Get the currently actve chain name.
  const activeChain = NetworkDirectory[directoryId as DirectoryId]?.name;

  // On focus handler.
  const onFocus = () => {
    onSearchFocused();
    setFocused(true);
  };

  // On blur handler.
  const onBlur = () => {
    onSearchBlurred();
    setFocused(false);
  };

  // On change handler.
  const onChange = (value: string) => {
    // If trimmed value and the current value is empty, don't update.
    if (!(!value.trim().length && searchValue === '')) {
      setSearchValue(value);
    }
  };

  // Determine search results from network directory.
  const results = NetworkDirectory;
  const filtered = !focused
    ? {}
    : searchValue === ''
      ? results
      : Object.fromEntries(
          Object.entries(results).filter(([, { name }]) =>
            name.toLowerCase().includes(searchValue.toLowerCase())
          )
        );

  // Total chain results.
  const totalResults = Object.keys(filtered).length;

  return (
    <>
      <ChainSearchInputWrapper>
        {focused && (
          <FontAwesomeIcon
            icon={faSearch}
            transform="shrink-3"
            className="icon"
          />
        )}
        <input
          placeholder="Search Chain"
          onChange={(ev) => onChange(ev.target.value)}
          onFocus={() => onFocus()}
          value={focused ? searchValue : activeChain}
          onKeyDown={(ev) => {
            // Exit on enter key.
            if (ev.key === 'Enter') {
              ev.currentTarget.blur();
              onBlur();
            }
            // Exit on escape key.
            if (ev.key === 'Escape') {
              ev.currentTarget.blur();
              onBlur();
            }
          }}
        />
        {focused && (
          <button onClick={() => onBlur()}>
            <FontAwesomeIcon icon={faTimes} transform="grow-1" />
          </button>
        )}
      </ChainSearchInputWrapper>
      {focused && (
        <ChainResultsWrapper>
          <h5>
            {totalResults} {totalResults === 1 ? 'Chain' : 'Chains'} Found
          </h5>
          <div className="results">
            {Object.entries(filtered).map(([key, { name }]) => (
              <ChainResultWrapper
                key={`connect_wallet_${key}`}
                onClick={() => {
                  setDirectoryId(key as DirectoryId);
                  setSearchValue(name);
                  onBlur();
                }}
              >
                {name}
              </ChainResultWrapper>
            ))}
          </div>
        </ChainResultsWrapper>
      )}
    </>
  );
};
