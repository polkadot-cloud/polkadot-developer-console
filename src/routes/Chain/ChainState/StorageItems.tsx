// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useMemo } from 'react';
import { PalletList } from '../PalletList';
import { PalletScraper } from 'model/Metadata/Scraper/Pallet';
import { useChainUi } from 'contexts/ChainUi';
import { ChainStateList } from './ChainStateList';
import { FormatInputFields } from 'model/Metadata/Format/InputFields';
import { useActiveTab } from 'contexts/ActiveTab';
import type { PalletData } from './types';
import { EncodedDetails } from './EncodedDetails';
import { InputForm } from './InputForm';
import type { InputNamespace } from 'contexts/ChainUi/types';
import { SelectFormWrapper } from 'library/Inputs/Wrappers';
import { useChain } from '../Provider';

export const StorageItems = () => {
  const { chainSpec } = useChain();
  const { tabId } = useActiveTab();
  const { getChainUi, setChainUiNamespace } = useChainUi();

  const chainUiSection = 'storage';
  const inputNamespace: InputNamespace = 'storage';
  const chainUi = getChainUi(tabId, chainUiSection);
  const Metadata = chainSpec.metadata;

  // Fetch storage data when metadata or the selected pallet changes.
  const storageData = useMemo((): PalletData => {
    // Get pallet list from scraper.
    const scraper = new PalletScraper(Metadata, { maxDepth: 7 });
    const pallets = scraper.getList(['storage']);

    // If no pallet selected, get first one from scraper or fall back to null.
    const activePallet = chainUi.pallet || pallets?.[0].name || null;

    // Get storage items for the active pallet.
    const palletStorage = activePallet
      ? scraper.getStorage(activePallet, { labelsOnly: true })
      : [];

    // Sort the storage items by name.
    const items = palletStorage.sort(({ name: nameA }, { name: nameB }) =>
      nameA < nameB ? -1 : nameA > nameB ? 1 : 0
    );

    const result: PalletData = {
      pallets,
      activePallet,
      items,
    };

    return result;
  }, [chainUi.pallet, Metadata?.metadata]);

  const { pallets, activePallet, items } = storageData;

  // If no storage item selected, select the first one from the list or fall back to null.
  const activeItem = chainUi.selected || items?.[0]?.name || null;

  // Get the whole active storage item record from metadata for input formatting.
  const activeListItem = useMemo(() => {
    if (!activePallet || !activeItem) {
      return null;
    }

    const scraper = new PalletScraper(Metadata, { maxDepth: '*' });
    return scraper.getStorageItem(activePallet, activeItem);
  }, [items, activeItem, activePallet]);

  // Get input markup for the active storage item.
  const inputForm =
    activePallet !== null && activeItem !== null && !!activeListItem
      ? new FormatInputFields(activeListItem).format()
      : null;

  return (
    <>
      <SelectFormWrapper className="withHeader">
        <PalletList
          pallets={pallets}
          activePallet={activePallet}
          chainUiSection={chainUiSection}
          onSelect={(value) => {
            setChainUiNamespace(tabId, chainUiSection, 'pallet', value);
          }}
        />
        <ChainStateList
          subject="Storage Item"
          items={items}
          inputNamespace={inputNamespace}
          activeItem={activeItem}
          chainUiSection={chainUiSection}
        />
      </SelectFormWrapper>
      <InputForm
        inputForm={inputForm}
        namespace={inputNamespace}
        activeItem={activeItem}
      />
      {activePallet && activeItem && (
        <EncodedDetails activePallet={activePallet} activeItem={activeItem} />
      )}
    </>
  );
};
