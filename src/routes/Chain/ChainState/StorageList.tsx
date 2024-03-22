// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { formatInputString } from 'Utils';
import { useChainUi } from 'contexts/ChainUi';
import type { ChainUiItem } from 'contexts/ChainUi/types';
import { useTabs } from 'contexts/Tabs';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import { FormatCallSignature } from 'model/Metadata/Format/CallSignature';
import type {
  PalletScraped,
  PalletScrapedWithSig,
} from 'model/Metadata/Scraper/types';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  SelectDropdownWrapper,
  SelectItemWrapper,
  SelectTextWrapper,
} from '../Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { SearchWrapper } from 'library/ContextMenu/Wrappers';

export const StorageList = ({
  storageItems,
  chainUiSection,
}: {
  storageItems: PalletScraped[];
  chainUiSection: keyof ChainUiItem;
}) => {
  const { activeTabId } = useTabs();
  const { getChainUi, setChainUiItem } = useChainUi();
  const chainUi = getChainUi(activeTabId, chainUiSection);

  // Storage selection open.
  const [storageOpen, setStorageOpenState] = useState<boolean>(false);

  // Setter for storage item menu open state.
  const setStorageOpen = (value: boolean) => {
    setStorageOpenState(value);
  };

  // Handle pallet search change.
  const handleStorageSearchChange = (value: string) => {
    setChainUiItem(activeTabId, chainUiSection, 'search', value);
  };

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
          name.toLowerCase().includes(formatInputString(chainUi.search, true))
        )
      : storageList;

  // Determine the currently selected item.
  const selectedItem =
    filteredStorageList.find(({ name }) => name === chainUi.selected) ||
    filteredStorageList[0] ||
    '';

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
    <section>
      <div className="inner">
        <h5>Storage Item</h5>
        <SelectItemWrapper
          className={`standalone${storageOpen ? ` open` : ``} ignore-outside-alerter-storage`}
          onClick={() => setStorageOpen(!storageOpen)}
        >
          <span>
            <SelectTextWrapper>
              {chainUi.selected || selectedItem.name || 'No Storage Items'}
              <span>{selectedItem?.callSig || ''}</span>
            </SelectTextWrapper>
          </span>
          <span>
            <h5>{selectedItem?.docs?.[0] || ''}</h5>
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
              value={chainUi.search}
              onChange={(ev) =>
                handleStorageSearchChange(ev.currentTarget.value)
              }
            />
          </SearchWrapper>

          {filteredStorageList.map(({ name, docs, callSig }) => (
            <SelectItemWrapper
              key={`storage_select_${name}`}
              className={`option${chainUi.selected === name ? ` selected` : ``}`}
              onClick={() => {
                setChainUiItem(activeTabId, chainUiSection, 'selected', name);
                setStorageOpen(false);
              }}
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
  );
};
