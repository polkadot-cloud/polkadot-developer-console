// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SelectFormWrapper } from '../Wrappers';
import { useApi } from 'contexts/Api';
import { useTabs } from 'contexts/Tabs';
import { PalletList } from '../PalletList';
import { CallList } from '../CallList';
import { useState } from 'react';
import { PalletScraper } from 'model/Metadata/Scraper/Pallet';

export const Extrinsics = () => {
  const { getChainSpec } = useApi();
  const { activeTabId } = useTabs();

  // The currently selected pallet.
  const [selectedPallet, setSelectedPallet] = useState<string | null>(null);

  const Metadata = getChainSpec(activeTabId)?.metadata;
  if (!Metadata) {
    // TODO: handle UI where metadata has not yet been fetched.
    return null;
  }

  const scraper = new PalletScraper(Metadata, { maxDepth: 2 });
  const pallets = scraper.getList(['calls']);

  const activePallet = selectedPallet || pallets?.[0].name || null;
  let calls = [];
  if (activePallet) {
    calls = scraper.getCalls(activePallet);
  }

  // Convert lookup types to TypeScript types.
  // NOTE: (I think) scraper needs to accumulate all types for a call, e.g. replace typeIds and
  // replace them with actual raw types, for `toRawType` to work.
  // const result = Metadata.metadata.asV14.lookup.types.map((value) => {
  //   // const type = value.type.def.type;
  //   return(value.type.def.toJSON());
  // });

  return (
    <SelectFormWrapper>
      {/* Pallet Selection */}
      <PalletList
        selected={activePallet}
        pallets={pallets}
        onSelect={(value) => setSelectedPallet(value)}
      />

      {/* Call Selection */}
      <CallList calls={calls} />
    </SelectFormWrapper>
  );
};
