// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useApi } from 'contexts/Api';
import { PalletList } from '../PalletList';
import { CallList } from './CallList';
import { PalletScraper } from 'model/Metadata/Scraper/Pallet';
import { useChainUi } from 'contexts/ChainUi';
import { Header } from './Header';
import { useActiveTab } from 'contexts/ActiveTab';
import { useMemo } from 'react';
import type { PalletData } from '../ChainState/types';
import { defaultPalletData } from '../ChainState/defaults';
import { FormatInputFields } from 'model/Metadata/Format/InputFields';
import { InputForm } from '../ChainState/InputForm';
import type { InputNamespace } from 'contexts/ChainUi/types';
import { SelectFormWrapper } from 'library/Inputs/Wrappers';

export const Extrinsics = () => {
  const { getChainSpec } = useApi();
  const { tabId, apiInstanceId } = useActiveTab();
  const { getChainUi, setChainUiNamespace } = useChainUi();

  const chainUiSection = 'calls';
  const inputNamespace: InputNamespace = 'call';

  const chainUi = getChainUi(tabId, chainUiSection);
  const Metadata = getChainSpec(apiInstanceId)?.metadata;

  // Fetch storage data when metadata or the selected pallet changes.
  const callData = useMemo((): PalletData => {
    if (!Metadata) {
      return defaultPalletData;
    }

    const scraper = new PalletScraper(Metadata, {
      maxDepth: 7,
    });
    const pallets = scraper.getList(['calls']);

    // If no pallet selected, get first one from scraper or fall back to null.
    const activePallet = chainUi.pallet || pallets?.[0].name || null;

    // Get call items for the active pallet.
    let items = activePallet ? scraper.getCalls(activePallet) : [];

    // Sort the call items by name.
    items = items.sort(({ name: nameA }, { name: nameB }) =>
      nameA < nameB ? -1 : nameA > nameB ? 1 : 0
    );

    const result: PalletData = {
      pallets,
      activePallet,
      items,
    };

    return result;
  }, [chainUi.pallet, chainUi.selected, Metadata?.metadata]);

  const { pallets, activePallet, items } = callData;

  // If no call is selected, select the first one from the list or fall back to null.
  const activeItem = chainUi.selected || items?.[0]?.name || null;

  // Get the whole call item record from metadata for input formatting.
  const activeListItem = useMemo(() => {
    if (!Metadata || !activePallet || !activeItem) {
      return null;
    }
    // NOTE: Currently limiting scraper to 7 recursive levels to avoid app freezing.
    const scraper = new PalletScraper(Metadata, { maxDepth: 7 });
    return scraper.getCallItem(activePallet, activeItem);
  }, [items, activeItem, activePallet]);

  // Get input markup for the active call item.
  const inputForm =
    activePallet !== null && activeItem !== null && !!activeListItem
      ? new FormatInputFields(activeListItem).format()
      : null;

  return (
    <>
      <Header />
      <SelectFormWrapper className="withHeader">
        <PalletList
          activePallet={activePallet}
          pallets={pallets}
          chainUiSection={chainUiSection}
          onSelect={(value) => {
            setChainUiNamespace(tabId, chainUiSection, 'pallet', value);
          }}
        />
        <CallList
          items={items}
          inputNamespace={inputNamespace}
          activeItem={activeItem}
        />
      </SelectFormWrapper>
      <InputForm
        inputForm={inputForm}
        namespace={inputNamespace}
        activeItem={activeItem}
      />
    </>
  );
};
