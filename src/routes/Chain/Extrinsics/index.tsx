// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SelectFormWrapper } from '../Wrappers';
import { useApi } from 'contexts/Api';
import { useTabs } from 'contexts/Tabs';
import { PalletList } from '../PalletList';
import { CallList } from '../CallList';
import { PalletScraper } from 'model/Metadata/Scraper/Pallet';
import { useChainUi } from 'contexts/ChainUi';
import { Header } from './Header';

export const Extrinsics = () => {
  const { getChainSpec } = useApi();
  const { activeTabId } = useTabs();
  const { getChainUi, setChainUiItem } = useChainUi();

  const chainUiSection = 'calls';
  const chainUi = getChainUi(activeTabId, chainUiSection);

  const Metadata = getChainSpec(activeTabId)?.metadata;
  // TODO: handle UI where metadata has not yet been fetched.
  if (!Metadata) {
    return null;
  }

  const scraper = new PalletScraper(Metadata, { maxDepth: 2 });
  const pallets = scraper.getList(['calls']);

  const activePallet = chainUi.pallet || pallets?.[0].name || null;
  let calls = [];
  if (activePallet) {
    calls = scraper.getCalls(activePallet);
  }

  return (
    <>
      <Header />
      <SelectFormWrapper className="withHeader">
        {/* Pallet Selection */}
        <PalletList
          activePallet={activePallet}
          pallets={pallets}
          chainUiSection={chainUiSection}
          onSelect={(value) => {
            setChainUiItem(activeTabId, chainUiSection, 'pallet', value);
          }}
        />

        {/* Call Selection */}
        <CallList calls={calls} />
      </SelectFormWrapper>
    </>
  );
};
