// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { formatInputString } from 'Utils';
import { useChainUi } from 'contexts/ChainUi';
import { FormatCallSignature } from 'model/Scraper/CallSignature';
import type { PalletItemScrapedWithSig } from 'model/Scraper/types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { camelize, setStateWithRef } from '@w3ux/utils';
import { useActiveTab } from 'contexts/ActiveTab';
import type { ChainStateListProps } from './types';
import { SearchInput } from 'library/ContextMenu/SearchInput';
import { useBrowseListWithKeys } from 'hooks/useBrowseListWithKeys';
import { SelectDropdown } from 'library/SelectDropdown';
import { SelectItemWrapper, SelectTextWrapper } from 'library/Inputs/Wrappers';
import { useSelectFirst } from 'hooks/useSelectFirst';

export const ChainStateList = ({
  items,
  chainUiSection,
  activeItem,
  subject,
  scraper,
  inputNamespace,
}: ChainStateListProps) => {
  const { tabId } = useActiveTab();
  const { getChainUi, setChainUiNamespace, resetInputArgs } = useChainUi();

  const chainUi = getChainUi(tabId, chainUiSection);

  // Whether dropdown is open.
  const [dropdownOpen, setDropdownOpenState] = useState<boolean>(false);
  const dropdownOpenRef = useRef(dropdownOpen);

  // Setter for pallet menu open state.
  const setDropdownOpen = (value: boolean) => {
    setStateWithRef(value, setDropdownOpenState, dropdownOpenRef);
  };

  // Handle search change.
  const handleSearchChange = (value: string) => {
    setChainUiNamespace(tabId, chainUiSection, 'search', value);
  };

  // Handle item change.
  const handleItemChange = (value: string, closeDropdown: boolean) => {
    // Updated the selected item in chain ui state if it has changed.
    if (activeListItem.name !== value) {
      setChainUiNamespace(tabId, chainUiSection, 'selected', value);

      // If an input namespace is provided, reset input arg values.
      if (inputNamespace) {
        resetInputArgs(tabId, inputNamespace);
      }
    }
    // Close item the dropdown if requested.
    if (closeDropdown) {
      setDropdownOpen(false);
    }
  };

  // Gets a filtered list by applying a search term on list items, if not empty.
  const getFilteredItems = (search: string) =>
    search !== ''
      ? list.filter(({ name }) =>
          name.toLowerCase().includes(formatInputString(search, true))
        )
      : list;

  // Inject call signature into items.
  const list: PalletItemScrapedWithSig[] = useMemo(
    () =>
      !scraper
        ? []
        : items.map((item) => ({
            ...item,
            callSig: new FormatCallSignature(item, scraper).format(),
          })),
    [items]
  );

  // Filter items based on search term, if selection is present.
  const filteredList = getFilteredItems(chainUi.search);

  // Get the active item from the filtered list.
  const activeListItem =
    list.find(({ name }) => name === activeItem) || list[0];

  // Determine the currently selected item from a filtered dropdown list.
  const filteredSelectedItem =
    filteredList.find(({ name }) => name === activeItem) ||
    filteredList[0] ||
    '';

  // Enable keyboard navigation for pallet selection.
  useBrowseListWithKeys({
    listItems: filteredList.map(({ name }) => name),
    listOpenRef: dropdownOpenRef,
    activeValue: activeItem,
    onUpdate: (value: string) => handleItemChange(value, false),
  });

  // Dropdown search input ref.
  const searchInputRef = useRef<HTMLInputElement>(null);

  // If the currently selected pallet is not in the filtered list, select the first item.
  useSelectFirst({
    isActive: chainUi['selectOnSearch'] === true,
    onSelect: (value) => handleItemChange(value, false),
    activeItem,
    searchTerm: chainUi.search,
    getFiltered: (searchTerm: string) =>
      getFilteredItems(searchTerm).map(({ name }) => name),
  });

  // Focus the call search input when the menu is opened.
  useEffect(() => {
    if (dropdownOpen) {
      searchInputRef.current?.focus();
    }
  }, [dropdownOpen]);

  return (
    <section>
      <div className="inner">
        <h5>{subject}</h5>
        <SelectItemWrapper
          className={`standalone${dropdownOpen ? ` open` : ``} ignore-outside-alerter-chain-state`}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span>
            <SelectTextWrapper>
              {activeListItem
                ? camelize(activeListItem.name)
                : `No ${subject}s`}
              <span>{activeListItem?.callSig || ''}</span>
            </SelectTextWrapper>
          </span>
          <span>
            <h5>{activeListItem?.docs?.[0] || ''}</h5>
            <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
          </span>
        </SelectItemWrapper>

        <SelectDropdown
          open={dropdownOpen}
          onOutsideClick={() => setDropdownOpen(false)}
          outsideAlerterIgnore={['ignore-outside-alerter-chain-state']}
        >
          <SearchInput
            inputRef={searchInputRef}
            value={chainUi.search}
            chainUiKeys={{
              searchKey: 'search',
              selectOnSearchKey: 'selectOnSearch',
            }}
            chainUiSection={chainUiSection}
            onChange={(ev) => handleSearchChange(ev.currentTarget.value)}
            onEnter={() => setDropdownOpen(false)}
            onEscape={() => setDropdownOpen(false)}
          />

          {filteredList.map(({ name, docs, callSig }) => (
            <SelectItemWrapper
              key={`${chainUiSection}_select_${name}`}
              className={`option${filteredSelectedItem.name === name ? ` selected` : ``}`}
              onClick={() => handleItemChange(name, true)}
            >
              <span>
                <SelectTextWrapper>
                  {camelize(name)}
                  <span>{callSig}</span>
                </SelectTextWrapper>
              </span>
              <span>
                <h5>{docs[0]}</h5>
              </span>
            </SelectItemWrapper>
          ))}
        </SelectDropdown>
      </div>
    </section>
  );
};
