// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChainMenuWrapper } from 'library/ChainMenu/Wrappers';
import { TabsToggle } from 'library/ChainMenu/TabsToggle';

export const Menu = () => (
  <ChainMenuWrapper>
    <div className="menu">
      <div>Settings</div>
    </div>
    <TabsToggle />
  </ChainMenuWrapper>
);
