// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { InputFormWrapper, SelectFormWrapper } from '../Wrappers';
import { useApi } from 'contexts/Api';
import { useTabs } from 'contexts/Tabs';
import { useMemo } from 'react';
import { PalletList } from '../PalletList';
import { PalletScraper } from 'model/Metadata/Scraper/Pallet';
import { useChainUi } from 'contexts/ChainUi';
import { ChainStateList } from './ChainStateList';
import { FormatInputFields } from 'model/Metadata/Format/InputFields';
import type { AnyJson } from '@w3ux/utils/types';

export const StorageItems = () => {
  const { activeTabId } = useTabs();
  const { getChainSpec } = useApi();
  const { getChainUi, setChainUiItem } = useChainUi();

  const chainUiSection = 'storage';
  const chainUi = getChainUi(activeTabId, chainUiSection);
  const Metadata = getChainSpec(activeTabId)?.metadata;

  // Fetch storage data when metadata or the selected pallet changes.
  const storageData = useMemo(() => {
    if (!Metadata) {
      return {
        pallets: [],
        activePallet: null,
        storageItems: [],
        activeStorageItem: null,
      };
    }
    // Get pallet list from scraper.
    const scraper = new PalletScraper(Metadata);
    const pallets = scraper.getList(['storage']);

    // If no pallet selected, get first one from scraper or fall back to null.
    const activePallet = chainUi.pallet || pallets?.[0].name || null;

    // Get storage items for the active pallet and sort by name.
    const storageItems = (
      activePallet ? scraper.getStorage(activePallet) : []
    ).sort(({ name: nameA }, { name: nameB }) =>
      nameA < nameB ? -1 : nameA > nameB ? 1 : 0
    );

    // If no storage item selected, select the first one from the list or fall back to null.
    const activeStorageItem =
      chainUi.selected || storageItems?.[0]?.name || null;

    return {
      pallets,
      activePallet,
      storageItems,
      activeStorageItem,
    };
  }, [chainUi.pallet, chainUi.selected, Metadata?.metadata]);

  const { pallets, activePallet, storageItems, activeStorageItem } =
    storageData;

  // Get the whole active storage item record for input formatting.
  const activeListItem = storageItems.find(
    (item) => item.name === activeStorageItem
  );

  // Get input markup for the active storage item.
  const inputForm =
    activePallet !== null && activeStorageItem !== null && !!activeListItem
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
            setChainUiItem(activeTabId, chainUiSection, 'pallet', value);
          }}
        />
        <ChainStateList
          subject="Storage Item"
          items={storageItems}
          activeItem={activeStorageItem}
          chainUiSection={chainUiSection}
        />
      </SelectFormWrapper>
      <InputFormWrapper>
        {!!inputForm &&
          Object.entries(inputForm).map(([key]: AnyJson, index) => (
            <h3 key={`input_index_${key}_${index}`}>item</h3>
          ))}
      </InputFormWrapper>
    </>
  );
};
