// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { RenameTab } from './RenameTab';
import { SearchChain } from './SearchChain';
import { ChainList } from './ChainList';
import { Wrapper } from './Wrappers';

export const Default = () => (
  <Wrapper>
    <RenameTab />
    <SearchChain />
    <ChainList />
  </Wrapper>
);
