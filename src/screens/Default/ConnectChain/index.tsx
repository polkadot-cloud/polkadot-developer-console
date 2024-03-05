// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChainList } from './ChainList';
import { AutoConnect } from './AutoConnect';
import { SearchChain } from './SearchChain';

export const ConnectChain = () => (
  <>
    <AutoConnect />
    <SearchChain />
    <ChainList />
  </>
);
