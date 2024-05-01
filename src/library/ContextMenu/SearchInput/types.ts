// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  ChainStateSection,
  ChainUiNamespaceInner,
} from 'contexts/ChainUi/types';
import type { ChangeEvent, RefObject } from 'react';

export interface SearchInputProps {
  inputRef: RefObject<HTMLInputElement>;
  value: string;
  onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
  onEnter: () => void;
  onEscape: () => void;
  chainUiSection?: ChainStateSection;
  chainUiKeys?: {
    searchKey: keyof ChainUiNamespaceInner;
    selectOnSearchKey: keyof ChainUiNamespaceInner;
  };
  searchValue?: string;
  setSearchValue?: (value: string) => void;
}
