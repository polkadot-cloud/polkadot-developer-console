// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useChainUi } from 'contexts/ChainUi';
import { useActiveTabId } from 'contexts/RenderedTab';
import { HeaderToggleWrapper } from 'library/HeaderToggle/Wrapper';

export const Header = () => {
  const activeTabId = useActiveTabId();
  const { getActiveChainStateSection, setActiveChainStateSection } =
    useChainUi();
  const activeToggle = getActiveChainStateSection(activeTabId);

  return (
    <HeaderToggleWrapper>
      <button
        className={activeToggle === 'storage' ? 'active' : undefined}
        onClick={() => setActiveChainStateSection(activeTabId, 'storage')}
      >
        Storage Items
      </button>
      <button
        className={activeToggle === 'constants' ? 'active' : undefined}
        onClick={() => setActiveChainStateSection(activeTabId, 'constants')}
      >
        Runtime Constants
      </button>
      <button
        className={activeToggle === 'raw' ? 'active' : undefined}
        onClick={() => setActiveChainStateSection(activeTabId, 'raw')}
      >
        Raw Storage
      </button>
    </HeaderToggleWrapper>
  );
};
