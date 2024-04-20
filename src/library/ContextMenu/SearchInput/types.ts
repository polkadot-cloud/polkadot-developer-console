// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  ChainStateSection,
  ChainUiItemInner,
} from 'contexts/ChainUi/types';
import type { ChangeEvent, RefObject } from 'react';

export interface SearchInputProps {
  inputRef: RefObject<HTMLInputElement>;
  value: string;
  onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
  onEnter: () => void;
  onEscape: () => void;
  chainUiSection?: ChainStateSection;
  chainUiKey?: keyof ChainUiItemInner;
  searchValue?: string;
  setSearchValue?: (value: string) => void;
}
