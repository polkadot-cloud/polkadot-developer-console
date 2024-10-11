// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import {
  ChainResultWrapper,
  ChainResultsWrapper,
  ChainSearchInputWrapper,
  SubHeadingWrapper,
} from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Suspense, lazy, useMemo, useState } from 'react';
import type { ChainSearchInputProps } from './types';
import type { DirectoryId } from 'config/networks/types';
import { NetworkDirectory } from 'config/networks';
import { getIconFilename } from 'config/networks/Utils';

export const ChainSearchInput = ({
  onSearchFocused,
  onSearchBlurred,
  directoryId,
  setDirectoryId,
  activeChain,
  supportedChains,
}: ChainSearchInputProps) => {
  // Whether the input is in focused state.
  const [focused, setFocused] = useState<boolean>(false);

  // The current search value of the input.
  const [searchValue, setSearchValue] = useState<string>('');

  // Get the currently actve chain name.
  const chainName = activeChain?.name;

  // Lazily load the icon for the chain.
  const Icon = useMemo(() => {
    try {
      return lazy(
        () =>
          import(
            `../../config/networks/icons/${getIconFilename(directoryId)}/Inline.tsx`
          )
      );
    } catch (e) {
      return undefined;
    }
  }, [directoryId]);

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

  // Determine search results from network directory. Start by filtering the directory by supported
  // chains.
  const results = supportedChains
    ? Object.fromEntries(
        Object.entries(NetworkDirectory).filter(([name]) =>
          supportedChains.includes(name.toLowerCase() as DirectoryId)
        )
      )
    : NetworkDirectory;

  // Filter results by search value.
  const filtered =
    searchValue === ''
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
        {focused ? (
          <FontAwesomeIcon
            icon={faSearch}
            transform="shrink-3"
            className="icon"
          />
        ) : (
          <Suspense fallback={undefined}>
            <span className="chainIcon">{Icon && <Icon />}</span>
          </Suspense>
        )}
        <input
          placeholder="Search Chain"
          onChange={(ev) => onChange(ev.target.value)}
          onFocus={() => onFocus()}
          value={focused ? searchValue : chainName}
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
          <button type="button" onClick={() => onBlur()}>
            <FontAwesomeIcon icon={faTimes} transform="grow-1" />
          </button>
        )}
      </ChainSearchInputWrapper>
      {focused && (
        <ChainResultsWrapper>
          <SubHeadingWrapper>
            <h5>
              {totalResults} {totalResults === 1 ? 'Chain' : 'Chains'} Found
            </h5>
          </SubHeadingWrapper>
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
