// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { formatInputString } from 'Utils';
import { useChainUi } from 'contexts/ChainUi';
import { camelize } from '@w3ux/utils';
import { useActiveTab } from 'contexts/ActiveTab';
import { SearchInput } from 'library/ContextMenu/SearchInput';
import { SelectDropdown } from 'library/SelectDropdown';
import type { CallListItem, CallListProps } from './types';
import { SelectItemWrapper, SelectTextWrapper } from 'library/Inputs/Wrappers';
import type { InputNamespace } from 'contexts/ChainUi/types';

export const CallList = ({ items }: CallListProps) => {
  const { tabId } = useActiveTab();
  const { getChainUi, setChainUiNamespace, resetInputArgs } = useChainUi();

  const chainUiSection = 'calls';
  const inputNamespace: InputNamespace = 'call';
  const chainUi = getChainUi(tabId, chainUiSection);

  // Call selection open.
  const [callsOpen, setCallsOpenState] = useState<boolean>(false);

  // Setter for call menu open state.
  const setCallsOpen = (value: boolean) => {
    setCallsOpenState(value);
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

  // Handle pallet search change.
  const handleCallSearchChange = (value: string) => {
    setChainUiNamespace(tabId, chainUiSection, 'search', value);
  };

  // Handle call change.
  const handleCallChange = (name: string) => {
    // Updated the selected item in chain ui state if it has changed.
    if (selectedItem?.name !== name) {
      setChainUiNamespace(tabId, chainUiSection, 'selected', name);
      resetInputArgs(tabId, inputNamespace);
    }
    setCallsOpen(false);
  };

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

          {filteredCalls.map(({ name, docs, fieldNames }: CallListItem) => (
            <SelectItemWrapper
              key={`call_select_${name}`}
              className="option"
              onClick={() => handleCallChange(name)}
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
          ))}
        </SelectDropdown>
      </div>
    </section>
  );
};
