// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  SelectItemWrapper,
  SelectFormWrapper,
  SelectTextWrapper,
  SelectDropdownWrapper,
} from '../Wrappers';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Header } from './Header';
import { useApi } from 'contexts/Api';
import { useTabs } from 'contexts/Tabs';
import { useRef, useState } from 'react';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import { MetadataScraper } from 'controllers/MetadataScraper';
import { PalletList } from '../PalletList';
import type { AnyJson } from '@w3ux/utils/types';

export const ChainState = () => {
  const { getChainSpec } = useApi();
  const { activeTabId } = useTabs();

  // The currently selected pallet.
  const [selectedPallet, setSelectedPallet] = useState<string | null>(null);

  // Storage selection open.
  const [storageOpen, setStorageOpenState] = useState<boolean>(false);

  // Setter for storage item menu open state.
  const setStorageOpen = (value: boolean) => {
    setStorageOpenState(value);
  };

  // Refs for the selection menus.
  const storageSelectRef = useRef(null);

  // Close storage selection if clicked outside of its container.
  useOutsideAlerter(
    storageSelectRef,
    () => {
      setStorageOpen(false);
    },
    ['ignore-outside-alerter-storage']
  );

  const Metadata = getChainSpec(activeTabId)?.metadata;
  if (!Metadata) {
    // TODO: handle UI where metadata has not yet been fetched.
    return null;
  }

  // Get pallet list from scraper.
  const scraper = new MetadataScraper(Metadata);
  const pallets = scraper.getPallets(['storage']);

  const activePallet = selectedPallet || pallets?.[0].name || null;
  let storage = [];
  if (activePallet) {
    storage = scraper.getPalletStorage(activePallet);
  }

  let selection: {
    docs: string[];
    name: string;
    types: AnyJson;
  }[] = storage;

  // Sort storage items alphabetically based on call name.
  selection = selection.sort(({ name: nameA }, { name: nameB }) =>
    nameA < nameB ? -1 : nameA > nameB ? 1 : 0
  );

  return (
    <>
      <Header />
      <SelectFormWrapper className="withHeader">
        {/* Pallet Selection */}
        <PalletList
          pallets={pallets}
          selected={activePallet}
          onSelect={(value) => setSelectedPallet(value)}
        />

        {/* Storage Item Selection */}

        <section>
          <h5>Storage Item</h5>
          <SelectItemWrapper
            className={`standalone${storageOpen ? ` open` : ``} ignore-outside-alerter-storage`}
            onClick={() => setStorageOpen(!storageOpen)}
          >
            <span>
              <SelectTextWrapper>
                {selection[0]?.name || 'No Storage Items'}
              </SelectTextWrapper>
            </span>
            <span>
              <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
            </span>
          </SelectItemWrapper>

          <SelectDropdownWrapper
            ref={storageSelectRef}
            className={`${storageOpen ? ` open` : ``}`}
          >
            {selection.map(({ name, docs }) => (
              <SelectItemWrapper
                key={`storage_select_${name}`}
                className="option"
                onClick={() => setStorageOpen(false)}
              >
                <span>
                  <SelectTextWrapper>
                    {name}
                    {/* {fieldNames && <span>({fieldNames})</span>} */}
                  </SelectTextWrapper>
                </span>
                <span>
                  <h5>{docs[0]}</h5>
                </span>
              </SelectItemWrapper>
            ))}
          </SelectDropdownWrapper>
        </section>
      </SelectFormWrapper>
    </>
  );
};
