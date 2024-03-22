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
import { useEffect, useMemo, useRef, useState } from 'react';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import { PalletList } from '../PalletList';
import { PalletScraper } from 'model/Metadata/Scraper/Pallet';
import { FormatCallSignature } from 'model/Metadata/Format/CallSignature';
import type { PalletScrapedWithSig } from 'model/Metadata/Scraper/types';
import { SearchWrapper } from 'library/ContextMenu/Wrappers';
import { formatInputString } from 'Utils';

export const ChainState = () => {
  const { activeTabId } = useTabs();
  const { getChainSpec } = useApi();
  const Metadata = getChainSpec(activeTabId)?.metadata;

  // The currently selected pallet.
  const [selectedPallet, setSelectedPallet] = useState<string | null>(null);

  // Storage selection open.
  const [storageOpen, setStorageOpenState] = useState<boolean>(false);

  // Storage item search term.
  const [storageSearchTerm, setStorageSearchTerm] = useState<string>('');

  // Setter for storage item menu open state.
  const setStorageOpen = (value: boolean) => {
    setStorageOpenState(value);
  };

  // Handle pallet search change.
  const handleStorageSearchChange = (value: string) => {
    setStorageSearchTerm(value);
  };

  // Fetch storage data when metadata or the selected pallet changes.
  const storageData = useMemo(() => {
    if (!Metadata) {
      return {
        pallets: [],
        activePallet: null,
        storageItems: [],
      };
    }
    // Get pallet list from scraper.
    const scraper = new PalletScraper(Metadata);
    const pallets = scraper.getList(['storage']);

    // If no pallet selected, get first one from scraper or fall back to null.
    const activePallet = selectedPallet || pallets?.[0].name || null;
    const storageItems = activePallet ? scraper.getStorage(activePallet) : [];

    return {
      storageItems,
      activePallet,
      pallets,
    };
  }, [selectedPallet, Metadata?.metadata]);

  const { pallets, activePallet, storageItems } = storageData;

  // Inject call signature into storage items.
  const storageList: PalletScrapedWithSig[] = useMemo(
    () =>
      storageItems
        .map((storageItem) => ({
          ...storageItem,
          callSig: new FormatCallSignature(storageItem).format(),
        }))
        .sort(({ name: nameA }, { name: nameB }) =>
          nameA < nameB ? -1 : nameA > nameB ? 1 : 0
        ),
    [storageItems]
  );

  // Filter calls based on search term, if selection is present.
  const filteredStorageList =
    storageList.length > 0
      ? storageList.filter(({ name }) =>
          name
            .toLowerCase()
            .includes(formatInputString(storageSearchTerm, true))
        )
      : storageList;

  // Refs for the selection menus.
  const storageSelectRef = useRef(null);

  // Storage search input ref.
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close storage selection if clicked outside of its container.
  useOutsideAlerter(
    storageSelectRef,
    () => {
      setStorageOpen(false);
    },
    ['ignore-outside-alerter-storage']
  );

  // Focus the call search input when the menu is opened.
  useEffect(() => {
    if (storageOpen) {
      searchInputRef.current?.focus();
    }
  }, [storageOpen]);

  return (
    <>
      <Header />
      <SelectFormWrapper className="withHeader">
        <PalletList
          pallets={pallets}
          selected={activePallet}
          onSelect={(value) => setSelectedPallet(value)}
        />

        <section>
          <div className="inner">
            <h5>Storage Item</h5>
            <SelectItemWrapper
              className={`standalone${storageOpen ? ` open` : ``} ignore-outside-alerter-storage`}
              onClick={() => setStorageOpen(!storageOpen)}
            >
              <span>
                <SelectTextWrapper>
                  {storageList[0]?.name || 'No Storage Items'}
                  <span>{storageList[0]?.callSig || ''}</span>
                </SelectTextWrapper>
              </span>
              <span>
                <h5>{storageList[0]?.docs?.[0] || ''}</h5>
                <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
              </span>
            </SelectItemWrapper>

            <SelectDropdownWrapper
              ref={storageSelectRef}
              className={`${storageOpen ? ` open` : ``}`}
            >
              <SearchWrapper>
                <input
                  ref={searchInputRef}
                  placeholder="Search"
                  value={storageSearchTerm}
                  onChange={(ev) =>
                    handleStorageSearchChange(ev.currentTarget.value)
                  }
                />
              </SearchWrapper>

              {filteredStorageList.map(({ name, docs, callSig }) => (
                <SelectItemWrapper
                  key={`storage_select_${name}`}
                  className="option"
                  onClick={() => setStorageOpen(false)}
                >
                  <span>
                    <SelectTextWrapper>
                      {name}
                      <span>{callSig}</span>
                    </SelectTextWrapper>
                  </span>
                  <span>
                    <h5>{docs[0]}</h5>
                  </span>
                </SelectItemWrapper>
              ))}
            </SelectDropdownWrapper>
          </div>
        </section>
      </SelectFormWrapper>
    </>
  );
};
