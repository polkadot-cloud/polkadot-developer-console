// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useMemo } from 'react';
import { PalletList } from '../PalletList';
import { PalletScraper } from 'model/Scraper/Pallet';
import { useChainUi } from 'contexts/ChainUi';
import { ChainStateList } from './ChainStateList';
import { useActiveTab } from 'contexts/ActiveTab';
import type { PalletData } from './types';
import { EncodedDetails } from './EncodedDetails';
import { SelectFormWrapper } from 'library/Inputs/Wrappers';
import { useChain } from '../Provider';
import { ChainStateController } from 'controllers/ChainState';
import type { AnyJson } from '@w3ux/types';
import { camelize } from '@w3ux/utils';
import { Results } from './Results';
import { InputFormProvider } from '../InputForm/provider';
import { InputForm } from '../InputForm';
import type { InputNamespace } from 'contexts/ChainUi/types';

export const StorageItems = () => {
  const { tabId } = useActiveTab();
  const { chainSpec, instanceId } = useChain();
  const { getChainUi, setChainUiNamespace, resetInputArgSection } =
    useChainUi();

  const chainUiSection = 'storage';
  const inputNamespace: InputNamespace = 'storage';
  const chainUi = getChainUi(tabId, chainUiSection);
  const Metadata = chainSpec.metadata;

  // Fetch storage items when metadata or the selected pallet changes.
  const scrapedStorageList = useMemo(() => {
    // Get pallet list from scraper.
    const scraper = new PalletScraper(Metadata, { maxDepth: 7 });
    const pallets = scraper.getPalletList([chainUiSection]);

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

    // Formatted storage and pallet data.
    const storageData: PalletData = {
      pallets,
      activePallet,
      items,
    };

    return { storageData, scraper };
  }, [chainUi.pallet, Metadata?.metadata]);

  const { storageData, scraper: listScraper } = scrapedStorageList;
  const { pallets, activePallet, items } = storageData;

  // Get the active storage item. If no storage item selected, select the first one from the list or
  // fall back to null.
  const activeItem = chainUi.selected || items?.[0]?.name || null;

  // Get the whole active storage item record from metadata for input arg formatting.
  const scraperResult = useMemo(() => {
    if (!activePallet || !activeItem) {
      return { scrapedItem: null, scraper: null };
    }

    const scraper = new PalletScraper(Metadata, { maxDepth: '*' });
    const scrapedItem = scraper.getStorageItem(activePallet, activeItem);

    return { scrapedItem, scraper };
  }, [activeItem, activePallet]);

  const { scrapedItem, scraper: itemScraper } = scraperResult;

  // Handle storage item query submission. This function is called after input arg formatting is
  // completed. No further formatting is required by this function. Exits early if active items or
  // value are not set.
  const onSubmit = (args: AnyJson) => {
    if (!activePallet || !activeItem) {
      return;
    }

    const chainState = ChainStateController.instances[instanceId];
    chainState.subscribe(`${activeItem}`, {
      type: 'storage',
      namespace: camelize(activePallet),
      method: camelize(activeItem),
      args,
    });
  };

  // Manage `activeItem` changes.
  useEffect(() => {
    // On initial render, set the selected item to the first list item, if any.
    if (activeItem) {
      setChainUiNamespace(tabId, chainUiSection, 'selected', activeItem);
    }
  }, [activeItem]);

  return (
    <InputFormProvider namespace={inputNamespace} scraper={itemScraper}>
      <SelectFormWrapper className="withHeader">
        <PalletList
          pallets={pallets}
          activePallet={activePallet}
          chainUiSection={chainUiSection}
          onSelect={(value) => {
            // Update selected pallet in chain ui state.
            setChainUiNamespace(tabId, chainUiSection, 'pallet', value);

            // Reset input args when selected pallet changes.
            resetInputArgSection(tabId, inputNamespace);
          }}
        />
        <ChainStateList
          scraper={listScraper}
          subject="Storage Item"
          items={items}
          activeItem={activeItem}
          chainUiSection={chainUiSection}
          inputNamespace={inputNamespace}
        />
      </SelectFormWrapper>
      <InputForm
        scraper={itemScraper}
        argTypes={scrapedItem?.argTypes}
        activePallet={activePallet}
        activeItem={activeItem}
        onSubmit={onSubmit}
      />
      {activePallet && activeItem && (
        <EncodedDetails activePallet={activePallet} activeItem={activeItem} />
      )}

      <Results storageType="storage" />
    </InputFormProvider>
  );
};
