// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ChainSearchInputWrapper } from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import type { ChainSearchInputProps } from './types';

export const ChainSearchInput = ({
  onSearchFocused,
  onSearchBlurred,
}: ChainSearchInputProps) => {
  // Whether the input is in focused state.
  const [focused, setFocused] = useState<boolean>(false);

  // The current search value of the input.
  const [searchValue, setSearchValue] = useState<string>('');

  // The currently active chain of the input.
  const [chain] = useState<string>('');

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

  return (
    <>
      <ChainSearchInputWrapper>
        {focused && <FontAwesomeIcon icon={faSearch} transform="shrink-3" />}
        <input
          placeholder="Search Chain"
          onChange={(ev) => onChange(ev.target.value)}
          onFocus={() => onFocus()}
          value={focused ? searchValue : chain}
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
      {focused && <h5>Chain Search...</h5>}
    </>
  );
};
