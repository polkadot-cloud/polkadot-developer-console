// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Separator } from '@polkadot-cloud/react';
import { ChainListWrapper } from './Wrappers';
import { NetworkDirectory } from 'config/networks';
import { ChainListItem } from './ChainListItem';

export const ChainList = () => (
  <ChainListWrapper>
    <Separator />
    {Object.entries(NetworkDirectory).map(([key, { name }]) => (
      <ChainListItem key={`chain_index_${key}`} networkKey={key} name={name} />
    ))}
  </ChainListWrapper>
);
