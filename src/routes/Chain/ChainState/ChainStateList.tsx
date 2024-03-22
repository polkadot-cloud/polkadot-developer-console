// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { formatInputString } from 'Utils';
import { useChainUi } from 'contexts/ChainUi';
import type { ChainUiItem } from 'contexts/ChainUi/types';
import { useTabs } from 'contexts/Tabs';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import { FormatCallSignature } from 'model/Metadata/Format/CallSignature';
import type {
  PalletItemScraped,
  PalletItemScrapedWithSig,
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

export const ChainStateList = ({
  items,
  chainUiSection,
  subject,
}: {
  subject: string;
  items: PalletItemScraped[];
  chainUiSection: keyof ChainUiItem;
}) => {
  const { activeTabId } = useTabs();
  const { getChainUi, setChainUiItem } = useChainUi();
  const chainUi = getChainUi(activeTabId, chainUiSection);

  // Whether dropdown is open.
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  // Handle search change.
  const handleSearchChange = (value: string) => {
    setChainUiItem(activeTabId, chainUiSection, 'search', value);
  };

  // Inject call signature into items.
  const list: PalletItemScrapedWithSig[] = useMemo(
    () =>
      items
        .map((item) => ({
          ...item,
          callSig: new FormatCallSignature(item).format(),
        }))
        .sort(({ name: nameA }, { name: nameB }) =>
          nameA < nameB ? -1 : nameA > nameB ? 1 : 0
        ),
    [items]
  );

  // Filter items based on search term, if selection is present.
  const filteredList =
    list.length > 0
      ? list.filter(({ name }) =>
          name.toLowerCase().includes(formatInputString(chainUi.search, true))
        )
      : list;

  // Determine the currently selected item.
  const selectedItem =
    filteredList.find(({ name }) => name === chainUi.selected) ||
    filteredList[0] ||
    '';

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
              {chainUi.selected || selectedItem.name || `No ${subject} Items`}
              <span>{selectedItem?.callSig || ''}</span>
            </SelectTextWrapper>
          </span>
          <span>
            <h5>{selectedItem?.docs?.[0] || ''}</h5>
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
            />
          </SearchWrapper>

          {filteredList.map(({ name, docs, callSig }) => (
            <SelectItemWrapper
              key={`${chainUiSection}_select_${name}`}
              className={`option${chainUi.selected === name ? ` selected` : ``}`}
              onClick={() => {
                setChainUiItem(activeTabId, chainUiSection, 'selected', name);
                setDropdownOpen(false);
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
