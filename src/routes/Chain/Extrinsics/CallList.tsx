// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useRef, useState } from 'react';
import { SelectItemWrapper, SelectTextWrapper } from '../Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import type { AnyJson } from '@w3ux/utils/types';
import { formatInputString } from 'Utils';
import { useChainUi } from 'contexts/ChainUi';
import { camelize } from '@w3ux/utils';
import { useActiveTabId } from 'contexts/ActiveTab';
import { SearchInput } from 'library/ContextMenu/SearchInput';
import { SelectDropdown } from 'library/SelectDropdown';
import type { CallListItem } from './types';

export const CallList = ({ items }: { items: AnyJson }) => {
  const activeTabId = useActiveTabId();
  const { getChainUi, setChainUiItem } = useChainUi();

  const chainUiSection = 'calls';
  const chainUi = getChainUi(activeTabId, chainUiSection);

  // Call selection open.
  const [callsOpen, setCallsOpenState] = useState<boolean>(false);

  // Setter for call menu open state.
  const setCallsOpen = (value: boolean) => {
    setCallsOpenState(value);
  };

  // Handle pallet search change.
  const handleCallSearchChange = (value: string) => {
    setChainUiItem(activeTabId, chainUiSection, 'search', value);
  };

  // Filter calls based on search term, if selection is present.
  const filteredCalls =
    items.length > 0
      ? items.filter(({ name }: CallListItem) =>
          name.toLowerCase().includes(formatInputString(chainUi.search, true))
        )
      : items;

  // Determine the currently selected item.
  const selectedItem =
    filteredCalls.find(({ name }: CallListItem) => name === chainUi.selected) ||
    filteredCalls[0] ||
    '';

  // Call search input ref.
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus the call search input when the menu is opened.
  useEffect(() => {
    if (callsOpen) {
      searchInputRef.current?.focus();
    }
  }, [callsOpen]);

  return (
    <section>
      <div className="inner">
        <h5>Call</h5>
        <SelectItemWrapper
          className={`standalone${callsOpen ? ` open` : ``} ignore-outside-alerter-calls`}
          onClick={() => {
            setCallsOpen(!callsOpen);
          }}
        >
          <span>
            <SelectTextWrapper>
              {selectedItem?.name ? camelize(selectedItem.name) : 'No Calls'}
              {selectedItem?.fieldNames && (
                <span>({selectedItem.fieldNames})</span>
              )}
            </SelectTextWrapper>
          </span>
          <span>
            <h5>{selectedItem?.docs?.[0] || ''}</h5>
            <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
          </span>
        </SelectItemWrapper>

        <SelectDropdown
          open={callsOpen}
          onOutsideClick={() => setCallsOpen(false)}
          outsideAlerterIgnore={['ignore-outside-alerter-calls']}
        >
          <SearchInput
            inputRef={searchInputRef}
            value={chainUi.search}
            chainUiKeys={{
              searchKey: 'search',
              selectOnSearchKey: 'selectOnSearch',
            }}
            chainUiSection={chainUiSection}
            onChange={(ev) => handleCallSearchChange(ev.currentTarget.value)}
            onEnter={() => setCallsOpen(false)}
            onEscape={() => setCallsOpen(false)}
          />

          {filteredCalls.map(({ name, docs, fieldNames }: CallListItem) => {
            console.log(fieldNames);
            return (
              <SelectItemWrapper
                key={`call_select_${name}`}
                className="option"
                onClick={() => {
                  setChainUiItem(activeTabId, chainUiSection, 'selected', name);
                  setCallsOpen(false);
                }}
              >
                <span>
                  <SelectTextWrapper>
                    {camelize(name)}
                    {fieldNames && <span>({fieldNames})</span>}
                  </SelectTextWrapper>
                </span>
                <span>
                  <h5>{docs[0]}</h5>
                </span>
              </SelectItemWrapper>
            );
          })}
        </SelectDropdown>
      </div>
    </section>
  );
};
