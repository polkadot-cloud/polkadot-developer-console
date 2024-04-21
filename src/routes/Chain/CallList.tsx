// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useRef, useState } from 'react';
import {
  SelectItemWrapper,
  SelectTextWrapper,
  SelectDropdownWrapper,
} from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import type { AnyJson } from '@w3ux/utils/types';
import { Format } from 'model/Metadata/Scraper/Format';
import { formatInputString } from 'Utils';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import { useChainUi } from 'contexts/ChainUi';
import { camelize } from '@w3ux/utils';
import { useActiveTabId } from 'contexts/ActiveTab';
import { SearchInput } from 'library/ContextMenu/SearchInput';

export const CallList = ({ calls }: { calls: AnyJson }) => {
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

  // Format calls into a new `selection` array for rendering.
  let selection: {
    name: string;
    docs: string[];
    fieldNames: string | undefined;
    fieldTypes: string | undefined;
  }[] = [];
  // Calls type should aways be a variant, but checking to prevent errors.
  if (calls && calls.type === 'variant') {
    calls.variant.forEach(
      ({
        name,
        docs,
        fields,
      }: {
        name: string;
        docs: string[];
        fields: AnyJson[];
      }) => {
        // Get string representations of field names only.
        const fieldNames = Format.fieldNames(fields);

        // Get string representations of field names and their types.
        const fieldTypes = Format.fieldTypes(fields);

        // Push the call, docs and formatted field values to `selection`.
        selection.push({ name, docs, fieldNames, fieldTypes });
      }
    );
  }

  // Sort calls alphabetically based on call name.
  selection = selection.sort(({ name: nameA }, { name: nameB }) =>
    nameA < nameB ? -1 : nameA > nameB ? 1 : 0
  );

  // Filter calls based on search term, if selection is present.
  const filteredCalls =
    selection.length > 0
      ? selection.filter(({ name }) =>
          name.toLowerCase().includes(formatInputString(chainUi.search, true))
        )
      : selection;

  // Determine the currently selected item.
  const selectedItem =
    filteredCalls.find(({ name }) => name === chainUi.selected) ||
    filteredCalls[0] ||
    '';

  // Refs for the selection menus.
  const callsSelectRef = useRef(null);

  // Call search input ref.
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close call selection if clicked outside of its container.
  useOutsideAlerter(
    callsSelectRef,
    () => {
      setCallsOpen(false);
    },
    ['ignore-outside-alerter-calls']
  );

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

        <SelectDropdownWrapper
          ref={callsSelectRef}
          className={`${callsOpen ? ` open` : ``}`}
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

          {filteredCalls.map(({ name, docs, fieldNames }) => (
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
          ))}
        </SelectDropdownWrapper>
      </div>
    </section>
  );
};
