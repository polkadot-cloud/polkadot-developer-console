// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  SelectItemWrapper,
  SelectTextWrapper,
  SelectDropdownWrapper,
} from './Wrappers';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import { formatInputString } from 'Utils';
import { useChainUi } from 'contexts/ChainUi';
import { camelize, setStateWithRef } from '@w3ux/utils';
import { useActiveTabId } from 'contexts/ActiveTab';
import type { PalletListProps } from './ChainState/types';
import { useEventListener } from 'usehooks-ts';
import { SearchInput } from 'library/ContextMenu/SearchInput';

export const PalletList = ({
  pallets,
  activePallet,
  chainUiSection,
  onSelect,
}: PalletListProps) => {
  const activeTabId = useActiveTabId();
  const { getPalletVersions, getChainUi, setChainUiItem } = useChainUi();

  const palletVersions = getPalletVersions(activeTabId) || {};
  const chainUi = getChainUi(activeTabId, chainUiSection);
  const { palletSearch } = chainUi;

  // Pallet selection open.
  const [palletsOpen, setPalletsOpenState] = useState<boolean>(false);
  const palletsOpenRef = useRef(palletsOpen);

  // Setter for pallet menu open state.
  const setPalletsOpen = (value: boolean) => {
    setStateWithRef(value, setPalletsOpenState, palletsOpenRef);
  };

  // Handle pallet search change.
  const handlePalletSearchChange = (value: string) => {
    setChainUiItem(activeTabId, chainUiSection, 'palletSearch', value);
  };

  // Filter providers based on search term, if present.
  const filteredPallets =
    palletSearch !== ''
      ? pallets.filter(({ name }) =>
          name.toLowerCase().includes(formatInputString(palletSearch, true))
        )
      : pallets;

  // Selection menu ref.
  const palletSelectRef = useRef<HTMLDivElement>(null);

  // Pallet search input ref.
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle key down events.
  const handleKeyDown = (ev: KeyboardEvent) => {
    const { type, key } = ev;
    const palletIndex = filteredPallets.findIndex(
      ({ name }) => name === activePallet
    );

    // Determine the new pallet index, defaulting to the active pallet if present in the filtered
    // list, otherwise 0
    let newIndex = palletIndex > filteredPallets.length - 1 ? 0 : palletIndex;
    if (palletsOpenRef.current && type === 'keydown') {
      if (key === 'ArrowDown') {
        newIndex = Math.min(newIndex + 1, filteredPallets.length - 1);
      } else if (key === 'ArrowUp') {
        newIndex = Math.max(newIndex - 1, 0);
      }

      // Update the active pallet if the index points to a valid filtered pallet.
      const newActivePallet = filteredPallets[newIndex]?.name;
      if (newActivePallet) {
        setChainUiItem(activeTabId, chainUiSection, 'pallet', newActivePallet);
      }
    }
  };

  // Close pallet selection if clicked outside of its container.
  useOutsideAlerter(
    palletSelectRef,
    () => {
      setPalletsOpen(false);
    },
    ['ignore-outside-alerter-pallets']
  );

  // Focus the pallet search input when the menu is opened.
  useEffect(() => {
    if (palletsOpen) {
      searchInputRef.current?.focus();
    }
  }, [palletsOpen]);

  // Listen for key down events for form control.
  const documentRef = useRef(document);
  useEventListener('keydown', handleKeyDown, documentRef);

  return (
    <section>
      <div className="inner">
        <h5>Pallet</h5>
        <SelectItemWrapper
          className={`standalone${palletsOpen ? ` open` : ``} ignore-outside-alerter-pallets`}
          onClick={() => {
            setPalletsOpen(!palletsOpen);
          }}
        >
          <span>
            <SelectTextWrapper>
              {activePallet ? camelize(activePallet) : 'No Pallets'}
            </SelectTextWrapper>
          </span>
          <span>
            {activePallet && palletVersions[activePallet] ? (
              <h5>v{palletVersions[activePallet]}</h5>
            ) : (
              ''
            )}

            <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
          </span>
        </SelectItemWrapper>

        <SelectDropdownWrapper
          ref={palletSelectRef}
          className={`${palletsOpen ? ` open` : ``}`}
        >
          <SearchInput
            inputRef={searchInputRef}
            value={palletSearch}
            chainUiKey="palletSearch"
            chainUiSection={chainUiSection}
            onChange={(ev) => handlePalletSearchChange(ev.currentTarget.value)}
            onEnter={() => setPalletsOpen(false)}
            onEscape={() => setPalletsOpen(false)}
          />

          {filteredPallets.map(({ index, name }) => (
            <SelectItemWrapper
              key={`pallet_${index}_${name}`}
              className={`option${activePallet === name ? ` selected` : ``}`}
              onClick={() => {
                setPalletsOpen(false);
                onSelect(name);
              }}
            >
              <span>
                <SelectTextWrapper>{camelize(name)}</SelectTextWrapper>
              </span>
              <span>
                {palletVersions[name] ? <h5>v{palletVersions[name]}</h5> : ''}
              </span>
            </SelectItemWrapper>
          ))}
        </SelectDropdownWrapper>
      </div>
    </section>
  );
};
