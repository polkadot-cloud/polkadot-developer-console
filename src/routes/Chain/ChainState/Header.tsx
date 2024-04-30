// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useChainUi } from 'contexts/ChainUi';
import { useActiveTab } from 'contexts/ActiveTab';
import { HeaderToggleWrapper } from 'library/HeaderToggle/Wrapper';

export const Header = () => {
  const { tabId } = useActiveTab();
  const { getActiveChainStateSection, setActiveChainStateSection } =
    useChainUi();
  const activeToggle = getActiveChainStateSection(tabId);

  return (
    <HeaderToggleWrapper>
      <button
        className={activeToggle === 'storage' ? 'active' : undefined}
        onClick={() => setActiveChainStateSection(tabId, 'storage')}
      >
        Storage Items
      </button>
      <button
        className={activeToggle === 'constants' ? 'active' : undefined}
        onClick={() => setActiveChainStateSection(tabId, 'constants')}
      >
        Runtime Constants
      </button>
      <button
        className={activeToggle === 'raw' ? 'active' : undefined}
        onClick={() => setActiveChainStateSection(tabId, 'raw')}
      >
        Raw Storage
      </button>
    </HeaderToggleWrapper>
  );
};
