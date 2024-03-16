// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SelectChainItemWrapper } from '../Wrappers';
import { useApi } from 'contexts/Api';
import { useTabs } from 'contexts/Tabs';
import { MetadataScraper } from 'controllers/MetadataScraper';
import { PalletList } from '../PalletList';
import { CallList } from '../CallList';

export const Extrinsics = () => {
  const { getChainSpec } = useApi();
  const { activeTabId } = useTabs();

  const Metadata = getChainSpec(activeTabId)?.metadata;
  if (!Metadata) {
    // TODO: handle UI where metadata has not yet been fetched.
    return null;
  }

  const scraper = new MetadataScraper(Metadata);
  const pallets = scraper.getPallets();

  // Get the calls for the `Staking` pallet.
  // TODO: Get calls from selected pallet.
  const calls = scraper.getPalletCalls('Staking');

  // Convert lookup types to TypeScript types
  // const typescriptTypes: AnyJson = [];

  // NOTE: (I think) scraper needs to accumulate all types for a call, e.g. replace typeIds and
  // replace them with actual raw types, for `toRawType` to work.
  // Metadata.metadata.asV14.lookup.types.forEach((value) => {
  //   // const type = value.type.def.type;
  //   typescriptTypes.push(value.type.def.toJSON());
  // });
  // console.log(typescriptTypes);

  return (
    <SelectChainItemWrapper>
      {/* Pallet Selection */}
      <PalletList pallets={pallets} />

      {/* Call Selection */}
      <CallList calls={calls} />
    </SelectChainItemWrapper>
  );
};
