// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Wrapper } from './Wrapper';
import type { SearchInputProps } from './types';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export const SearchInput = ({ placeholder, value }: SearchInputProps) => (
  <Wrapper>
    <div className="inner">
      <FontAwesomeIcon icon={faSearch} className="icon" />
      <input placeholder={placeholder} value={value} />
    </div>
  </Wrapper>
);
