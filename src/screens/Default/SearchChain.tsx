// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SearchInput } from 'library/SearchInput';
import { SearchChainWrapper } from './Wrappers';

export const SearchChain = () => (
  <SearchChainWrapper>
    <SearchInput placeholder="Search Chain" value="Polkadot Relay Chain" />
  </SearchChainWrapper>
);
