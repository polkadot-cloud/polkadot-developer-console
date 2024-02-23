// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { RenameTab } from './RenameTab';
import { SearchChain } from './SearchChain';
import { ChainList } from './ChainList';
import { Wrapper } from '../Wrappers';
import { Menu } from './Menu';
import { Body } from 'library/Body';

export const Default = () => (
  <>
    <Menu />
    <Body>
      <Wrapper>
        <RenameTab />
        <SearchChain />
        <ChainList />
      </Wrapper>
    </Body>
  </>
);
