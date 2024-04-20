// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { formatInputString } from 'Utils';
import { useChainUi } from 'contexts/ChainUi';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import { FormatCallSignature } from 'model/Metadata/Format/CallSignature';
import type { PalletItemScrapedWithSig } from 'model/Metadata/Scraper/types';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  SelectDropdownWrapper,
  SelectItemWrapper,
  SelectTextWrapper,
} from '../Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { camelize, setStateWithRef } from '@w3ux/utils';
import { useActiveTabId } from 'contexts/ActiveTab';
import type { ChainStateListProps } from './types';
import { SearchInput } from 'library/ContextMenu/SearchInput';
import { useBrowseListWithKeys } from 'hooks/useBrowseListWithKeys';

export const ChainStateList = ({
  items,
  chainUiSection,
  activeItem,
  subject,
}: ChainStateListProps) => {
  const activeTabId = useActiveTabId();
  const { getChainUi, setChainUiItem } = useChainUi();
  const chainUi = getChainUi(activeTabId, chainUiSection);

  // Whether dropdown is open.
  const [dropdownOpen, setDropdownOpenState] = useState<boolean>(false);
  const dropdownOpenRef = useRef(dropdownOpen);

  // Setter for pallet menu open state.
  const setDropdownOpen = (value: boolean) => {
    setStateWithRef(value, setDropdownOpenState, dropdownOpenRef);
  };

  // Handle search change.
  const handleSearchChange = (value: string) => {
    setChainUiItem(activeTabId, chainUiSection, 'search', value);
  };

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
  const filteredList =
    list.length > 0
      ? list.filter(({ name }) =>
          name.toLowerCase().includes(formatInputString(chainUi.search, true))
        )
      : list;

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
      setChainUiItem(activeTabId, chainUiSection, 'selected', newItem);
    },
  });

  // Refs for the selection menus.
  const dropdownRef = useRef(null);

  // Dropdown search input ref.
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown if clicked outside of its container.
  useOutsideAlerter(
    dropdownRef,
    () => {
      setDropdownOpen(false);
    },
    ['ignore-outside-alerter-chain-state']
  );

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

        <SelectDropdownWrapper
          ref={dropdownRef}
          className={`${dropdownOpen ? ` open` : ``}`}
        >
          <SearchInput
            inputRef={searchInputRef}
            value={chainUi.search}
            chainUiKey="search"
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
                setChainUiItem(activeTabId, chainUiSection, 'selected', name);
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
        </SelectDropdownWrapper>
      </div>
    </section>
  );
};
