// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChainList } from './ChainList';
import { RenameTab } from './RenameTab';
import { SearchChain } from './SearchChain';

export const Default = () => (
  <>
    <RenameTab />
    <SearchChain />
    <ChainList />
  </>
);
