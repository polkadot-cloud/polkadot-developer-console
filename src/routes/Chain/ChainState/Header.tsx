// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useChainUi } from 'contexts/ChainUi';
import { useActiveTab } from 'contexts/ActiveTab';
import { HeaderToggleWrapper } from 'library/HeaderToggle/Wrapper';

export const Header = () => {
  const { tabId } = useActiveTab();
  const { getChainStateSection, setChainStateSection } = useChainUi();
  const activeToggle = getChainStateSection(tabId);

  return (
    <HeaderToggleWrapper>
      <button
        className={activeToggle === 'storage' ? 'active' : undefined}
        onClick={() => setChainStateSection(tabId, 'storage')}
      >
        Storage Items
      </button>
      <button
        className={activeToggle === 'constants' ? 'active' : undefined}
        onClick={() => setChainStateSection(tabId, 'constants')}
      >
        Runtime Constants
      </button>
      <button
        className={activeToggle === 'raw' ? 'active' : undefined}
        onClick={() => setChainStateSection(tabId, 'raw')}
      >
        Raw Storage
      </button>
    </HeaderToggleWrapper>
  );
};
