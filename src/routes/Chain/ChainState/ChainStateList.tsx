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
import { SearchWrapper } from 'library/ContextMenu/Wrappers';
import { camelize, setStateWithRef } from '@w3ux/utils';
import { useActiveTabId } from 'contexts/ActiveTab';
import type { ChainStateListProps } from './types';
import { useEventListener } from 'usehooks-ts';

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

  // Handle key down events.
  const handleKeyDown = (ev: KeyboardEvent) => {
    const { type, key } = ev;
    const itemIndex = filteredList.findIndex(({ name }) => name === activeItem);

    // Determine the new pallet index, defaulting to the active item if present in the filtered
    // list, otherwise 0
    let newIndex = itemIndex > filteredList.length - 1 ? 0 : itemIndex;
    if (dropdownOpenRef.current && type === 'keydown') {
      if (key === 'ArrowDown') {
        newIndex = Math.min(newIndex + 1, filteredList.length - 1);
      } else if (key === 'ArrowUp') {
        newIndex = Math.max(newIndex - 1, 0);
      }

      // Update the active item if the index points to a valid filtered item.
      const newActiveItem = filteredList[newIndex]?.name;
      if (newActiveItem) {
        setChainUiItem(activeTabId, chainUiSection, 'selected', newActiveItem);
      }
    }
  };

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

  // Listen for key down events for form control.
  const documentRef = useRef(document);
  useEventListener('keydown', handleKeyDown, documentRef);

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
          <SearchWrapper>
            <input
              ref={searchInputRef}
              placeholder="Search"
              value={chainUi.search}
              onChange={(ev) => handleSearchChange(ev.currentTarget.value)}
              onKeyDown={(ev) => {
                // Close and retain search value on enter key.
                if (ev.key === 'Enter') {
                  setDropdownOpen(false);
                }
                if (ev.key === 'Escape') {
                  // If search value exists, first clear it.
                  if (chainUi.search.length > 0) {
                    setChainUiItem(activeTabId, chainUiSection, 'search', '');
                  } else {
                    // No search, go ahead and close dropdown.
                    setDropdownOpen(false);
                  }
                }
              }}
            />
          </SearchWrapper>

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
