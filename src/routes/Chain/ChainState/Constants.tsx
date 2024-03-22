// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SelectFormWrapper } from '../Wrappers';
import { useApi } from 'contexts/Api';
import { useTabs } from 'contexts/Tabs';
import { useMemo } from 'react';
import { PalletList } from '../PalletList';
import { PalletScraper } from 'model/Metadata/Scraper/Pallet';
import { useChainUi } from 'contexts/ChainUi';
import { ChainStateList } from './ChainStateList';

export const Constants = () => {
  const { activeTabId } = useTabs();
  const { getChainSpec } = useApi();
  const { getChainUi, setChainUiItem } = useChainUi();

  const chainUiSection = 'constants';
  const chainUi = getChainUi(activeTabId, chainUiSection);
  const Metadata = getChainSpec(activeTabId)?.metadata;

  // Fetch storage data when metadata or the selected pallet changes.
  const constantsData = useMemo(() => {
    if (!Metadata) {
      return {
        pallets: [],
        activePallet: null,
        constantItems: [],
      };
    }
    // Get pallet list from scraper.
    const scraper = new PalletScraper(Metadata);
    const pallets = scraper.getList(['constants']);

    // If no pallet selected, get first one from scraper or fall back to null.
    const activePallet = chainUi.pallet || pallets?.[0].name || null;

    const constantItems = activePallet
      ? scraper.getConstants(activePallet)
      : [];

    return {
      constantItems,
      activePallet,
      pallets,
    };
  }, [chainUi.pallet, Metadata?.metadata]);

  const { pallets, activePallet, constantItems } = constantsData;

  return (
    <SelectFormWrapper className="withHeader">
      <PalletList
        pallets={pallets}
        activePallet={activePallet}
        chainUiSection={chainUiSection}
        onSelect={(value) => {
          setChainUiItem(activeTabId, chainUiSection, 'pallet', value);
        }}
      />
      <ChainStateList
        subject="Constant Item"
        items={constantItems}
        chainUiSection={chainUiSection}
      />
    </SelectFormWrapper>
  );
};
