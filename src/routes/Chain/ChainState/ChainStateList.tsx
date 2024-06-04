// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { formatInputString } from 'Utils';
import { useChainUi } from 'contexts/ChainUi';
import { FormatCallSignature } from 'model/Metadata/Format/CallSignature';
import type { PalletItemScrapedWithSig } from 'model/Metadata/Scraper/types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { camelize, setStateWithRef } from '@w3ux/utils';
import { useActiveTab } from 'contexts/ActiveTab';
import type { ChainStateListProps } from './types';
import { SearchInput } from 'library/ContextMenu/SearchInput';
import { useBrowseListWithKeys } from 'hooks/useBrowseListWithKeys';
import { useSelectFirst } from 'hooks/useSelectFirst';
import { SelectDropdown } from 'library/SelectDropdown';
import { SelectItemWrapper, SelectTextWrapper } from 'library/Inputs/Wrappers';
import { useInputForm } from '../InputForm/provider';

export const ChainStateList = ({
  items,
  chainUiSection,
  activeItem,
  subject,
}: ChainStateListProps) => {
  const { tabId } = useActiveTab();
  const { namespace } = useInputForm();
  const { getChainUi, setChainUiNamespace, resetInputArgSection } =
    useChainUi();

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
      items.map((item) => ({
        ...item,
        callSig: new FormatCallSignature(item).format(),
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
    onUpdate: (newItem: string) => {
      setChainUiNamespace(tabId, chainUiSection, 'selected', newItem);
    },
  });

  // Dropdown search input ref.
  const searchInputRef = useRef<HTMLInputElement>(null);

  // If the currently selected pallet is not in the filtered list, select the first item.
  useSelectFirst({
    isActive: chainUi['selectOnSearch'] === true,
    onSelect: (value) => {
      setChainUiNamespace(tabId, chainUiSection, 'selected', value);
    },
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

  // Manage `activeItem` changes.
  useEffect(() => {
    // Reset input args when active item changes.
    if (namespace) {
      resetInputArgSection(tabId, namespace);
    }

    // On initial render, set the selected item to the first list item, if any.
    if (activeItem) {
      setChainUiNamespace(tabId, chainUiSection, 'selected', activeItem);
    }
  }, [activeItem]);

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
              onClick={() => {
                setChainUiNamespace(tabId, chainUiSection, 'selected', name);
                setDropdownOpen(false);
              }}
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
