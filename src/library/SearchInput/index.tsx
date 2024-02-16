// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Wrapper } from './Wrapper';
import type { SearchInputProps } from './types';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export const SearchInput = ({
  placeholder,
  value,
  onChange,
}: SearchInputProps) => {
  // Whether the input is in focus.
  const [focus, setFocus] = useState<boolean>(false);

  return (
    <Wrapper>
      <h5 className={`${focus ? ' focus' : undefined}`}>Search Chain</h5>
      <div className={`inner ${focus ? ' focus' : undefined}`}>
        <FontAwesomeIcon icon={faSearch} className="icon" />
        <input
          placeholder={placeholder}
          value={value}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={(ev) => onChange(ev.currentTarget.value)}
        />
      </div>
    </Wrapper>
  );
};
