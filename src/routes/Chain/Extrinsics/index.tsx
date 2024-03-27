// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SelectFormWrapper } from '../Wrappers';
import { useApi } from 'contexts/Api';
import { PalletList } from '../PalletList';
import { CallList } from '../CallList';
import { PalletScraper } from 'model/Metadata/Scraper/Pallet';
import { useChainUi } from 'contexts/ChainUi';
import { Header } from './Header';
import { useActiveTabId } from 'contexts/ActiveTab';
import { useMemo, useRef } from 'react';
import type { PalletData } from '../ChainState/types';
import { defaultPalletData } from '../ChainState/defaults';

export const Extrinsics = () => {
  const { getChainSpec } = useApi();
  const activeTabId = useActiveTabId();
  const { getChainUi, setChainUiItem } = useChainUi();

  const chainUiSection = 'calls';
  const chainUi = getChainUi(activeTabId, chainUiSection);
  const Metadata = getChainSpec(activeTabId)?.metadata;

  // Store `callData` result as a ref for event listeners to access.
  const callDataRef = useRef<PalletData>(defaultPalletData);

  // Fetch storage data when metadata or the selected pallet changes.
  const callData = useMemo((): PalletData => {
    if (!Metadata) {
      return defaultPalletData;
    }

    const scraper = new PalletScraper(Metadata, { maxDepth: 2 });
    const pallets = scraper.getList(['calls']);

    const activePallet = chainUi.pallet || pallets?.[0].name || null;

    let items = [];
    if (activePallet) {
      items = scraper.getCalls(activePallet);
    }

    const result: PalletData = {
      pallets,
      activePallet,
      items,
      activeItem: null, // NOTE: not yet implemented.
    };

    // Update ref and return result.
    callDataRef.current = result;
    return result;
  }, [chainUi.pallet, chainUi.selected, Metadata?.metadata]);

  const { pallets, activePallet, items } = callData;

  return (
    <>
      <Header />
      <SelectFormWrapper className="withHeader">
        <PalletList
          palletDataRef={callDataRef}
          activePallet={activePallet}
          pallets={pallets}
          chainUiSection={chainUiSection}
          onSelect={(value) => {
            setChainUiItem(activeTabId, chainUiSection, 'pallet', value);
          }}
        />
        <CallList calls={items} />
      </SelectFormWrapper>
    </>
  );
};
