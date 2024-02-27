// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChainListWrapper, Separator } from './Wrappers';
import { NetworkDirectory } from 'config/networks';
import { ChainListItem } from './ChainListItem';

export const ChainList = () => (
  <ChainListWrapper>
    <Separator />
    <h4>3 Chains Found</h4>

    {Object.entries(NetworkDirectory).map(([key, { name }]) => (
      <ChainListItem key={`chain_index_${key}`} chain={key} name={name} />
    ))}
  </ChainListWrapper>
);
